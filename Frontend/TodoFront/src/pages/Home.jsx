import { Link } from "react-router-dom"
import "../styles/home.css"

function Home() {
  return (
    <div className="home-container">

      <div className="home-content">

        <h1 className="home-title">
          Organize suas tarefas com facilidade
        </h1>

        <p className="home-description">
          Gerencie tarefas, compartilhe com amigos e acompanhe produtividade.
        </p>

        <div className="home-buttons">

          <Link to="/register" className="primary-button">
            Começar agora
          </Link>

          <Link to="/login" className="secondary-button">
            Fazer login
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Home