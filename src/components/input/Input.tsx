import { useField } from 'formik'

import styles from './Input.module.css'

interface IInputProps {
  label: string
  name: string
  type: string
}

const Input = (props: IInputProps): JSX.Element => {
  const [field, meta] = useField(props)
  const aria = meta.touched ? { 'aria-invalid': !!meta.error } : {}
  return (
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <input {...field} {...props} {...aria} />
      {meta.touched && meta.error ? (
        <small className={styles.error}>{meta.error}</small>
      ) : null}
    </div>
  )
}

export default Input
