import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

interface IBackButtonProps {
  href: string
}

const BackButton = ({ href }: IBackButtonProps): JSX.Element => {
  return (
    <Link href={href}>
      <a className="outline secondary" role="button">
        <FiArrowLeft />
      </a>
    </Link>
  )
}

export default BackButton
