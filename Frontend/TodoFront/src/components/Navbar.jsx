import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          TodoList
        </h1>

        <div className="flex gap-4">
          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar