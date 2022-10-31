import copy from 'copy-to-clipboard'
import { FiCopy } from 'react-icons/fi'

import { useAppDispatch } from '../../../app/hooks'
import { setSuccessToast, setErrorToast } from '../../toast/toastSlice'

interface ICopyButtonProps {
  text: string
}

const CopyButton = ({ text }: ICopyButtonProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    try {
      copy(text)
      dispatch(setSuccessToast('Skopiowano!'))
    } catch {
      dispatch(setErrorToast('Nie udało się skopiować.'))
    }
  }

  return (
    <a onClick={handleClick} href="#">
      <FiCopy />
    </a>
  )
}

export default CopyButton
