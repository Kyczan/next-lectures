import { useField } from 'formik'

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
      <input {...field} {...props} {...aria} data-testid="input" />
      {meta.touched && meta.error ? (
        <small className="error-text">{meta.error}</small>
      ) : null}
    </div>
  )
}

export default Input
