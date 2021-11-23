import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'

import Select from './Select'

describe('<Select />', () => {
  const options = [
    { name: 'name1', value: 'value1', data: { _id: 'value1' } },
    { name: 'name2', value: 'value2', data: { _id: 'value2' } },
  ]

  it('renders error message without crashing', async () => {
    const initialValues = {
      title: null,
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

  it('handles change function', async () => {
    const handleSubmitMockFn = jest.fn()
    const initialValues = {
      title: { _id: 'value1' },
    }

    const { getByTestId, getByText } = render(
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

    const select = getByTestId('select')
    fireEvent.click(select)
    userEvent.type(select, 'name')

    const option = getByText('name2')
    fireEvent.mouseDown(option)

    const saveBtn = getByTestId('submit-form')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(handleSubmitMockFn).toHaveBeenCalled()
    })
  })

  it('handles reset function', async () => {
    const handleSubmitMockFn = jest.fn()
    const initialValues = {
      title: { _id: 'value1' },
    }

    const { getByTestId } = render(
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

    const deleteBtn = getByTestId('select-delete-btn')
    fireEvent.click(deleteBtn)

    const saveBtn = getByTestId('submit-form')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(handleSubmitMockFn).toHaveBeenCalled()
    })
  })
})
