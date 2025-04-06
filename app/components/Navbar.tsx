import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          Kanban Board
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <Link href="/boards" className="btn btn-primary">
            My Boards
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
