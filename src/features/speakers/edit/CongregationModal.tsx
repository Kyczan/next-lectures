import { Formik, Form } from 'formik'
import { FiCheck, FiSlash } from 'react-icons/fi'

import Modal from '../../../components/modal/Modal'
import Input from '../../../components/input/Input'

const CongregationModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const initialValues = {
    congregation: '',
  }

  const validate = (values) => {
    type ErrorsType = {
      congregation?: string
    }
    const errors: ErrorsType = {}
    if (!values.congregation) {
      errors.congregation = 'Zbór jest wymagany'
    }
    return errors
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <Input label="Dodaj nowy zbór *" name="congregation" type="text" />
            <footer className="inline-wrapper inline-wrapper--end">
              <button onClick={onRequestClose} className="secondary with-icon">
                <FiSlash />
                Anuluj
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                aria-busy={formik.isSubmitting}
                className="with-icon"
              >
                <FiCheck /> Zapisz
              </button>
            </footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CongregationModal
