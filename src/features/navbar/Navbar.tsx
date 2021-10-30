import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './Navbar.module.css'

interface IRoutes {
  link: string
  name: string
}

const routes: IRoutes[] = [
  {
    link: '/plan',
    name: 'Plan',
  },
  {
    link: '/lectures',
    name: 'Wykłady',
  },
  {
    link: '/speakers',
    name: 'Mówcy',
  },
]

const Navbar = (): JSX.Element => {
  const { pathname } = useRouter()
  const isRouteMatching = (link) => {
    return pathname.startsWith(link)
  }

  return (
    <nav className={`container-fluid ${styles.nav}`}>
      <ul>
        <li>
          <Link href="/">
            <a className="contrast">
              <strong>Planer</strong>
            </a>
          </Link>
        </li>
      </ul>
      <ul>
        {routes.map(({ link, name }) => (
          <li key={link}>
            <Link href={link}>
              <a
                className={cn({
                  secondary: !isRouteMatching(link),
                  contrast: isRouteMatching(link),
                })}
              >
                {name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
