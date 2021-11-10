import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'

import Input from './Input'

describe('<Input>', () => {
  it('renders without crashing', async () => {
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
          <Input label="Title" name="title" type="text" />
        </Form>
      </Formik>
    )

    const input = getByTestId('input') as HTMLInputElement

    userEvent.type(input, 'test')
    fireEvent.blur(input)
    userEvent.clear(input)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(getByText('Title is required')).toBeInTheDocument()
    })
  })
})
