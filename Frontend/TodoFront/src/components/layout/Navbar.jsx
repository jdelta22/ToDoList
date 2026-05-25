import { Link, useNavigate } from "react-router-dom"

function Navbar() {

  const navigate = useNavigate()

  const token = localStorage.getItem(
    "access"
  )

  function handleLogout() {

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    navigate("/login")
  }

  return (

    <nav className="bg-gray-900 text-white px-6 py-4">

      <div className="flex items-center justify-between">

        <h1 className="text-xl font-bold">
          TodoList
        </h1>

        <div className="flex gap-4 items-center">

          <Link to="/">
            Home
          </Link>

          {!token ? (
            <>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>

            </>
          ) : (
            <>

              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/shared">
                Compartilhadas
              </Link>

              <Link to="/received">
                Recebidas
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>

            </>
          )}

        </div>

      </div>

    </nav>
  )
}

export default Navbar