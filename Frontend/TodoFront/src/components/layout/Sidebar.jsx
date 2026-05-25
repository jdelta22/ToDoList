import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

import { AuthContext } from "../../context/AuthContext"

import "../../styles/sidebar.css"

function Sidebar() {

  const navigate = useNavigate()

  const { logout } = useContext(AuthContext)

  const [isOpen, setIsOpen] = useState(true)

  function handleLogout() {

    logout()

    navigate("/login")
  }

  return (
    <div className="sidebar-container">

      <aside
        className={`sidebar ${
          isOpen ? "" : "closed"
        }`}
      >

        <div className="sidebar-header">

          <h1 className="sidebar-title">
            TodoList
          </h1>

          <button
            className="sidebar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "←" : "→"}
          </button>

        </div>

        <div className="sidebar-content">

          <nav className="sidebar-nav">

            <Link
              to="/dashboard"
              className="sidebar-link"
            >
              Minhas tarefas
            </Link>

            <Link
              to="/shared"
              className="sidebar-link"
            >
              Compartilhadas
            </Link>

            <Link
              to="/received"
              className="sidebar-link"
            >
              Recebidas
            </Link>
            <Link
              to="/categories"
              className="hover:text-blue-400 transition"
            >
              Categorias
            </Link>

            <button
              onClick={handleLogout}
              className="sidebar-logout"
            >
              Logout
            </button>

          </nav>

        </div>

      </aside>

    </div>
  )
}
export default Sidebar