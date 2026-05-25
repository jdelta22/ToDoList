import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"

import "../styles/login.css"
import api from "../services/api"
import { AuthContext } from "../context/AuthContext"

function Login() {

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const response = await api.post(
        "/token/",
        {
          username,
          password,
        }
      )
      localStorage.setItem(
        "access",
        response.data.access
      )
      localStorage.setItem(
        "refresh",
        response.data.refresh
      )
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Login
        </h1>

        <form className="auth-form" onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Nome de usuário"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          

          <input
            type="password"
            placeholder="Senha"
            className="auth-input"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />

          <button className="auth-button">
            Entrar
          </button>

        </form>

        <p className="auth-footer">
          Não possui conta?{" "}

          <Link
            to="/register"
            className="auth-link"
          >
            Registrar
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login  