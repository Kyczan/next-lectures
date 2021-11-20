import { useEffect } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import BackButton from '../../../components/buttons/backButton/BackButton'
import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  fetchSpeakers,
  updateSpeaker,
  addSpeaker,
  selectSpeakers,
  selectSpeakerById,
} from '../speakersSlice'

interface ISpeakerEdit {
  id?: string
}

const SpeakerEdit = ({ id }: ISpeakerEdit): JSX.Element => {
  const isEdit = !!id
  const router = useRouter()
  const dispatch = useAppDispatch()
  const speaker = useAppSelector(selectSpeakerById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectSpeakers)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  const initialValues = {
    name: speaker?.name || '',
    congregation: speaker?.congregation || '',
    note: speaker?.note || '',
  }

  const validate = (values) => {
    type ErrorsType = {
      name?: string
    }
    const errors: ErrorsType = {}
    if (!values.name) {
      errors.name = 'Imię i Nazwisko jest wymagane'
    }
    return errors
  }

  const handleSubmit = async (values) => {
    if (isEdit) {
      await dispatch(updateSpeaker({ _id: id, ...values }))
      router.push(`/speakers/${id}`)
    } else {
      await dispatch(addSpeaker(values))
      router.push('/speakers')
    }
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href={`/speakers/${isEdit ? id : ''}`} />
        <h1>{isEdit ? 'Edycja' : 'Dodawanie'} mówcy</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && 'Error'}
      {status === ApiCallStatuses.SUCCEEDED && (
        <article>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <Input label="Imię i Nazwisko *" name="name" type="text" />
                <Input label="Zbór" name="congregation" type="text" />
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

export default SpeakerEdit
