import { useEffect, useMemo, useState } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave, FiPlus } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import Select from '../../../components/select/Select'
import CongregationModal from './CongregationModal'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../../app/hooks'
import {
  fetchSpeakers,
  updateSpeaker,
  addSpeaker,
  selectSpeakers,
  selectSpeakerById,
} from '../speakersSlice'

import styles from './SpeakerEdit.module.css'

interface ISpeakerEdit {
  id?: string
}

const SpeakerEdit = ({ id }: ISpeakerEdit): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const [initCongregation, setInitCongregation] = useState(null)
  const isEdit = !!id
  const router = useRouter()
  const dispatch = useAppDispatch()
  const speaker = useAppSelector(selectSpeakerById(id))
  const {
    data,
    fetch: { status },
  } = useAppSelector(selectSpeakers)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (speaker) {
      setInitCongregation(
        speaker.congregation ? { _id: speaker.congregation } : null
      )
    }
  }, [speaker])

  const initialValues = {
    name: speaker?.name || '',
    congregation: initCongregation,
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

  const sorter = (a, b) => {
    return a.localeCompare(b, 'pl', { numeric: true })
  }

  const createCongregationObj = (item) => ({
    _id: item,
    name: item,
    value: item,
    data: {
      _id: item,
    },
  })

  const congregationsOptions = useMemo(() => {
    const congregations = data
      .map((item) => item.congregation)
      .filter((item) => !!item)
    const uniqueSorted = Array.from(new Set(congregations)).sort(sorter)

    return uniqueSorted.map((item) => createCongregationObj(item))
  }, [data])

  const handleRefresh = () => {
    dispatch(fetchSpeakers())
  }

  const handleAddCongregation = ({ congregation }) => {
    const congregationObj = createCongregationObj(congregation)
    congregationsOptions.push(congregationObj)
    setInitCongregation(congregationObj)
    toggleModal()
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
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && isEdit && !speaker && (
        <Page404 />
      )}
      {status === ApiCallStatuses.SUCCEEDED && (!isEdit || !!speaker) && (
        <>
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
                  <div className={styles.congregation}>
                    <Select
                      label="Zbór"
                      name="congregation"
                      placeholder="Wybierz zbór"
                      options={congregationsOptions}
                    />
                    <button
                      className="secondary outline"
                      data-testid="add-congregation-btn"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleModal()
                      }}
                    >
                      <FiPlus />
                    </button>
                  </div>
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
          <CongregationModal
            isOpen={isModalOpen}
            onRequestClose={toggleModal}
            onSubmit={handleAddCongregation}
          />
        </>
      )}
    </section>
  )
}

export default SpeakerEdit
