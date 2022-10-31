import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

interface ILinkInDetailsProps {
  href?: string
}

const GotoButton = ({ href }: ILinkInDetailsProps): JSX.Element => {
  if (!href) return null

  return (
    <Link href={href}>
      <a>
        <FiArrowRight />
      </a>
    </Link>
  )
}

export default GotoButton
