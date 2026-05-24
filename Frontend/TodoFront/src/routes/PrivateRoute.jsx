import { useContext } from "react"
import { Navigate } from "react-router-dom"

import { AuthContext } from "../context/AuthContext"

function PrivateRoute({ children }) {

  const { authenticated } = useContext(AuthContext)

  if (!authenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute