import { useEffect, useMemo, useState } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import Select from '../../../components/select/Select'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import { ApiCallStatuses, IFilter, SortOrder } from '../../../app/types'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  fetchPlan,
  updatePlan,
  addPlan,
  selectPlan,
  selectPlanById,
} from '../planSlice'
import {
  fetchLectures,
  selectLectures,
  ILecturesSearchKeys,
  ILecturesSortKeys,
} from '../../lectures/lecturesSlice'
import {
  fetchSpeakers,
  selectSpeakers,
  ISpeakersSearchKeys,
  ISpeakersSortKeys,
} from '../../speakers/speakersSlice'
import { applyFilter } from '../../../utils/filter/applyFilter'

interface IPlanEdit {
  id?: string
}

const PlanEdit = ({ id }: IPlanEdit): JSX.Element => {
  const [status, setStatus] = useState(ApiCallStatuses.IDLE)
  const isEdit = !!id
  const router = useRouter()
  const dispatch = useAppDispatch()
  const plan = useAppSelector(selectPlanById(id))
  const {
    fetch: { status: planStatus },
  } = useAppSelector(selectPlan)
  const {
    data: lecturesData,
    fetch: { status: lecturesStatus },
  } = useAppSelector(selectLectures)
  const {
    data: speakersData,
    fetch: { status: speakersStatus },
  } = useAppSelector(selectSpeakers)

  useEffect(() => {
    if (planStatus === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [planStatus, dispatch])

  useEffect(() => {
    if (lecturesStatus === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [lecturesStatus, dispatch])

  useEffect(() => {
    if (speakersStatus === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [speakersStatus, dispatch])

  useEffect(() => {
    const statuses = [planStatus, lecturesStatus, speakersStatus]

    if (statuses.includes(ApiCallStatuses.FAILED)) {
      setStatus(ApiCallStatuses.FAILED)
    } else if (statuses.includes(ApiCallStatuses.LOADING)) {
      setStatus(ApiCallStatuses.LOADING)
    } else if (statuses.every((item) => item === ApiCallStatuses.SUCCEEDED)) {
      setStatus(ApiCallStatuses.SUCCEEDED)
    }
  }, [planStatus, lecturesStatus, speakersStatus])

  const initialValues = {
    date: plan?.date || '',
    lecture: plan?.lecture || null,
    speaker: plan?.speaker || null,
    note: plan?.note || '',
  }

  const validate = (values) => {
    type ErrorsType = {
      date?: string
    }
    const errors: ErrorsType = {}
    if (!values.date) {
      errors.date = 'Data jest wymagana'
    }
    return errors
  }

  const handleSubmit = async (values) => {
    if (isEdit) {
      await dispatch(updatePlan({ _id: id, ...values }))
      router.push(`/plan/${id}`)
    } else {
      await dispatch(addPlan(values))
      router.push('/plan')
    }
  }

  const lecturesOptions = useMemo(() => {
    const filter: IFilter<ILecturesSearchKeys, ILecturesSortKeys> = {
      sort: {
        key: 'number',
        order: SortOrder.ASC,
      },
    }
    const filtered = applyFilter(lecturesData, filter)
    return filtered.map((item) => {
      return {
        name: `${item.number}. ${item.title}`,
        value: item._id,
        data: item,
      }
    })
  }, [lecturesData])

  const speakersOptions = useMemo(() => {
    const filter: IFilter<ISpeakersSearchKeys, ISpeakersSortKeys> = {
      sort: {
        key: 'name',
        order: SortOrder.ASC,
      },
    }
    const filtered = applyFilter(speakersData, filter)
    return filtered.map((item) => {
      return {
        name: item.name,
        value: item._id,
        data: item,
      }
    })
  }, [speakersData])

  const handleRefresh = () => {
    if (planStatus === ApiCallStatuses.FAILED) dispatch(fetchPlan())
    if (lecturesStatus === ApiCallStatuses.FAILED) dispatch(fetchLectures())
    if (speakersStatus === ApiCallStatuses.FAILED) dispatch(fetchSpeakers())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href={`/plan/${isEdit ? id : ''}`} />
        <h1>{isEdit ? 'Edycja' : 'Dodawanie'} wydarzenia</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && isEdit && !plan && <Page404 />}
      {status === ApiCallStatuses.SUCCEEDED && (!isEdit || !!plan) && (
        <article>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <Input label="Data *" name="date" type="date" />
                <Select
                  label="Wykład"
                  name="lecture"
                  placeholder="Wybierz wykład"
                  options={lecturesOptions}
                />
                <Select
                  label="Mówca"
                  name="speaker"
                  placeholder="Wybierz mówcę"
                  options={speakersOptions}
                />
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

export default PlanEdit
