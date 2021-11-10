import { useEffect } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import BackButton from '../../../components/buttons/backButton/BackButton'
import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  fetchLectures,
  updateLecture,
  addLecture,
  selectLectures,
  selectLectureById,
} from '../lecturesSlice'

interface ILectureEdit {
  id?: string
}

const LectureEdit = ({ id }: ILectureEdit): JSX.Element => {
  const isEdit = !!id
  const router = useRouter()
  const dispatch = useAppDispatch()
  const lecture = useAppSelector(selectLectureById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectLectures)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  const initialValues = {
    number: lecture?.number || '',
    title: lecture?.title || '',
    note: lecture?.note || '',
  }

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
      await dispatch(updateLecture({ _id: id, ...values }))
      router.push(`/lectures/${id}`)
    } else {
      await dispatch(addLecture(values))
      router.push('/lectures')
    }
  }

  return (
    <>
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
                >
                  <FiSave />
                  Zapisz
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </article>
    </>
  )
}

export default LectureEdit
