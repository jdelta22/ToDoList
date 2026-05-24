import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"

import { AuthContext } from "../context/AuthContext"

function Sidebar() {

  const navigate = useNavigate()

  const { logout } = useContext(AuthContext)

  function handleLogout() {

    logout()

    navigate("/login")
  }

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-8">
        TodoList
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:text-blue-400 transition"
        >
          Minhas tarefas
        </Link>

        <Link
          to="/shared"
          className="hover:text-blue-400 transition"
        >
          Compartilhadas
        </Link>

        <Link
          to="/received"
          className="hover:text-blue-400 transition"
        >
          Recebidas
        </Link>

        <button
          onClick={handleLogout}
          className="text-left hover:text-red-400 transition"
        >
          Logout
        </button>

      </nav>

    </aside>
  )
}

export default Sidebar