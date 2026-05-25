import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api"

import "../styles/login.css"
import "../styles/register.css"

function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")

  async function handleRegister(e) {

    e.preventDefault()

    setError("")

    // validação simples de email
    if (!email.includes("@")) {

      setError("Digite um email válido")

      return
    }

    try {

      await api.post("/register/", {
        username,
        email,
        password,
      })

      alert("Conta criada com sucesso")

      navigate("/login")

    } catch (error) {

      console.log(error)

      setError(
        "Erro ao criar conta"
      )
    }
  }

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Registro
        </h1>

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <input
            type="text"
            placeholder="Usuário"
            className="auth-input"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="auth-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button className="register-button">
            Criar conta
          </button>

        </form>

        <p className="auth-footer">

          Já possui conta?{" "}

          <Link
            to="/login"
            className="auth-link"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Register