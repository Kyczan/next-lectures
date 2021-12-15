import { useEffect, useMemo } from 'react'
import { Formik, Form } from 'formik'
import { FiSave, FiPlus } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import Select from '../../../components/select/Select'
import CongregationModal from './CongregationModal'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import { ApiCallStatuses } from '../../../app/types'
import {
  useAppSelector,
  useAppDispatch,
  useToggle,
  useMsgOnSuccessAndFailure,
} from '../../../app/hooks'
import {
  fetchSpeakers,
  updateSpeaker,
  addSpeaker,
  selectSpeakers,
  selectSpeakerById,
  resetAddStatus,
  resetUpdateStatus,
} from '../speakersSlice'

import styles from './SpeakerEdit.module.css'

interface ISpeakerEdit {
  id?: string
}

const SpeakerEdit = ({ id }: ISpeakerEdit): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const isEdit = !!id
  const dispatch = useAppDispatch()
  const speaker = useAppSelector(selectSpeakerById(id))
  const {
    data,
    fetch: { status },
    add: { status: addStatus },
    update: { status: updateStatus },
  } = useAppSelector(selectSpeakers)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  // handle add
  useMsgOnSuccessAndFailure(
    addStatus,
    resetAddStatus,
    'Dodano mówcę',
    'Błąd podczas dodawania',
    '/speakers'
  )

  // handle update
  useMsgOnSuccessAndFailure(
    updateStatus,
    resetUpdateStatus,
    'Zaktualizowano mówcę',
    'Błąd podczas zapisywania',
    `/speakers/${id}`
  )

  const initialValues = {
    name: speaker?.name || '',
    congregation: speaker?.congregation ? { _id: speaker.congregation } : null,
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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (isEdit) {
      await dispatch(updateSpeaker({ _id: id, ...values }))
    } else {
      await dispatch(addSpeaker(values))
    }
    setSubmitting(false)
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
              {(formik) => {
                const handleAddCongregation = ({ congregation }) => {
                  const congregationObj = createCongregationObj(congregation)
                  congregationsOptions.push(congregationObj)
                  formik.setFieldValue('congregation', congregationObj)
                  toggleModal()
                }
                return (
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
                    <CongregationModal
                      isOpen={isModalOpen}
                      onRequestClose={toggleModal}
                      onSubmit={handleAddCongregation}
                    />
                  </Form>
                )
              }}
            </Formik>
          </article>
        </>
      )}
    </section>
  )
}

export default SpeakerEdit
