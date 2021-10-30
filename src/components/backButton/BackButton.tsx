import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

interface IBackButtonProps {
  href: string
}

const Backbutton = ({ href }: IBackButtonProps): JSX.Element => {
  return (
    <Link href={href}>
      <a className="outline secondary" role="button">
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
    </Link>
  )
}

export default Backbutton
