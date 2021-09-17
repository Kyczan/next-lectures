import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface IRoutes {
  link: string
  name: string
}

const routes: IRoutes[] = [
  {
    link: '/',
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
  const currentRouteName =
    routes.find((route) => route.link === pathname)?.name || '404'

  return (
    <nav className="container">
      <ul>
        <li>
          <Link href="/">
            <a className="contrast">
              <strong>Planer</strong>&nbsp;&nbsp;|&nbsp;&nbsp;{currentRouteName}
            </a>
          </Link>
        </li>
        <li>
          <input type="text" id="search" name="search" placeholder="Search" />
        </li>
      </ul>
      <ul>
        {routes.map(({ link, name }) => (
          <li key={link}>
            <Link href={link}>
              <a
                className={cn({
                  secondary: pathname !== link,
                  contrast: pathname === link,
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
