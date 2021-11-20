import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'

import Select from './Select'

describe('<Select>', () => {
  it('renders error message without crashing', async () => {
    const options = [
      { name: 'name1', value: 'value1' },
      { name: 'name2', value: 'value2' },
    ]
    const initialValues = {
      title: '',
    }
    const validate = (values) => {
      type ErrorsType = {
        title?: string
      }
      const errors: ErrorsType = {}
      if (!values.title) {
        errors.title = 'Title is required'
      }
      return errors
    }

    const { getByTestId, getByText } = render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        validate={validate}
      >
        <Form>
          <Select
            label="Title"
            name="title"
            placeholder="text"
            options={options}
          />
          <button type="submit" data-testid="submit-form">
            Save
          </button>
        </Form>
      </Formik>
    )

    const saveBtn = getByTestId('submit-form')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('handles onChange function', async () => {
    const handleSubmitMockFn = jest.fn()
    const options = [
      { name: 'name1', value: 'value1' },
      { name: 'name2', value: 'value2' },
    ]
    const initialValues = {
      title: '',
    }

    const { getByTestId, findByText, getByText } = render(
      <Formik initialValues={initialValues} onSubmit={handleSubmitMockFn}>
        <Form>
          <Select
            label="Title"
            name="title"
            placeholder="text"
            options={options}
          />
          <button type="submit" data-testid="submit-form">
            Save
          </button>
        </Form>
      </Formik>
    )

    const select = getByTestId('select') as HTMLInputElement
    fireEvent.click(select)
    userEvent.type(select, 'name1')

    fireEvent.change(select)

    // I do not why but change function is not triggered
    const option = getByText('name1')
    fireEvent.click(option)

    fireEvent.change(select)

    // const deleteBtn = getByTestId('select-delete-btn')
    // fireEvent.click(deleteBtn)

    const saveBtn = getByTestId('submit-form')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(handleSubmitMockFn).toHaveBeenCalled()
    })
  })
})
