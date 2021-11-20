import { useEffect, useMemo } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import Select from '../../../components/select/Select'
import BackButton from '../../../components/buttons/backButton/BackButton'
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

  return (
    <>
      <div className="inline-wrapper">
        <BackButton href={`/plan/${isEdit ? id : ''}`} />
        <h1>{isEdit ? 'Edycja' : 'Dodawanie'} wydarzenia</h1>
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
    </>
  )
}

export default PlanEdit
