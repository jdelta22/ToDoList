import { Link } from "react-router-dom"

import "../styles/login.css"
import "../styles/register.css"

function Register() {
  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Registro
        </h1>

        <form className="auth-form">

          <input
            type="text"
            placeholder="Usuário"
            className="auth-input"
          />

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Senha"
            className="auth-input"
          />

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