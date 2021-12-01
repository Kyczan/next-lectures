import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import {
  addLecture,
  editLecture,
  useLectureById,
} from '../../../app/hooks/lectures'
import Input from '../../../components/input/Input'
import BackButton from '../../../components/buttons/backButton/BackButton'

interface ILectureEdit {
  id?: string
}

const LectureEdit = ({ id }: ILectureEdit): JSX.Element => {
  const isEdit = !!id
  const router = useRouter()
  const { lecture } = useLectureById(id)

  const initialValues = {
    number: lecture?.number || '',
    title: lecture?.title || '',
    note: lecture?.note || '',
  }

  // const initialValues = {
  //   number: '',
  //   title: '',
  //   note: '',
  // }

  const validate = (values) => {
    type ErrorsType = {
      number?: string
      title?: string
    }
    const errors: ErrorsType = {}
    if (!values.number) {
      errors.number = 'Numer jest wymagany'
    }
    if (!values.title) {
      errors.title = 'Tytuł jest wymagany'
    }
    return errors
  }

  const handleSubmit = async (values) => {
    if (isEdit) {
      await editLecture({ _id: id, ...values })
      // router.push(`/lectures/${id}`)
      router.push(`/lectures`)
    } else {
      await addLecture(values)
      router.push('/lectures')
    }
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href={`/lectures/${isEdit ? id : ''}`} />
        <h1>{isEdit ? 'Edycja' : 'Dodawanie'} wykładu</h1>
      </div>
      <article>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Input label="Numer *" name="number" type="text" />
              <Input label="Tytuł *" name="title" type="text" />
              <Input label="Notatka" name="note" type="text" />
              <div className="inline-wrapper inline-wrapper--end">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  aria-busy={formik.isSubmitting}
                  className="with-icon"
                  data-testid="submit-form"
                >
                  <FiSave />
                  Zapisz
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  )
}

export default LectureEdit
