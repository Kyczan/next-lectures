import { useEffect } from 'react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { FiSave } from 'react-icons/fi'

import Input from '../../../components/input/Input'
import BackButton from '../../../components/buttons/backButton/BackButton'
import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  fetchPlan,
  updatePlan,
  addPlan,
  selectPlan,
  selectPlanById,
} from '../planSlice'

interface IPlanEdit {
  id?: string
}

const PlanEdit = ({ id }: IPlanEdit): JSX.Element => {
  const isEdit = !!id
  const router = useRouter()
  const dispatch = useAppDispatch()
  const plan = useAppSelector(selectPlanById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectPlan)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [status, dispatch])

  const initialValues = {
    date: plan?.date || '',
    lecture: plan?.lecture || '',
    speaker: plan?.speaker || '',
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
              <Input label="Data *" name="date" type="text" />
              <Input label="Wykład" name="lecture" type="text" />
              <Input label="Mówca" name="speaker" type="text" />
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
