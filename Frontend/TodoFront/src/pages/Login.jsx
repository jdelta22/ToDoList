import { Link } from "react-router-dom"
import "../styles/login.css"

function Login() {
  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Login
        </h1>

        <form className="auth-form">

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