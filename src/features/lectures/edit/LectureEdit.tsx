import { useEffect } from 'react'
import { Formik, Form } from 'formik'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import { ApiCallStatuses } from '../../../app/types'
import {
  useAppSelector,
  useAppDispatch,
  useMsgOnSuccessAndFailure,
} from '../../../app/hooks'
import {
  fetchLectures,
  updateLecture,
  addLecture,
  selectLectures,
  selectLectureById,
  resetAddStatus,
  resetUpdateStatus,
} from '../lecturesSlice'

interface ILectureEdit {
  id?: string
}

const LectureEdit = ({ id }: ILectureEdit): JSX.Element => {
  const isEdit = !!id
  const dispatch = useAppDispatch()
  const lecture = useAppSelector(selectLectureById(id))
  const {
    fetch: { status },
    add: { status: addStatus },
    update: { status: updateStatus },
  } = useAppSelector(selectLectures)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  // handle add
  useMsgOnSuccessAndFailure(
    addStatus,
    resetAddStatus,
    'Dodano wykład',
    'Błąd podczas dodawania',
    '/lectures'
  )

  // handle update
  useMsgOnSuccessAndFailure(
    updateStatus,
    resetUpdateStatus,
    'Zaktualizowano wykład',
    'Błąd podczas zapisywania',
    `/lectures/${id}`
  )

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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (isEdit) {
      await dispatch(updateLecture({ _id: id, ...values }))
    } else {
      await dispatch(addLecture(values))
    }
    setSubmitting(false)
  }

  const handleRefresh = () => {
    dispatch(fetchLectures())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href={`/lectures/${isEdit ? id : ''}`} />
        <h1>{isEdit ? 'Edycja' : 'Dodawanie'} wykładu</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && isEdit && !lecture && (
        <Page404 />
      )}
      {status === ApiCallStatuses.SUCCEEDED && (!isEdit || !!lecture) && (
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
      )}
    </section>
  )
}

export default LectureEdit
