import { useEffect, useState } from "react"

import api from "../services/api"

import "../styles/received-shares.css"
import Sidebar from "../components/layout/Sidebar"

function ReceivedSharesPage() {

  const [shares, setShares] = useState([])

  const [loading, setLoading] = useState(true)

  async function fetchShares() {

    try {

      const response = await api.get(
        "/received-shares/"
      )

      setShares(response.data.results)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  async function acceptShare(id) {

    try {

      await api.post(
        `/received-shares/${id}/accept/`
      )

      fetchShares()

    } catch (error) {

      console.log(error)
    }
  }

  async function declineShare(id) {

    try {

      await api.post(
        `/received-shares/${id}/decline/`
      )

      fetchShares()

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchShares()

  }, [])

  const pendingShares = shares.filter(
    (share) => share.accepted === null
  )

  const acceptedShares = shares.filter(
    (share) => share.accepted === true
  )

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
  <div className="dashboard-container">

    <Sidebar />

    <main className="dashboard-content">

      <h1 className="received-title">
        Compartilhadas comigo
      </h1>

      <section className="received-section">

        <h2 className="section-title">
          Convites pendentes
        </h2>

        {
          pendingShares.length === 0 && (
            <p>Nenhum convite pendente.</p>
          )
        }

        {
          pendingShares.map((share) => (

            <div
              key={share.id}
              className="share-card"
            >

              <h3 className="share-task-title">
                {share.task.title}
              </h3>

              <p className="share-description">
                {share.task.description}
              </p>

              <p className="share-owner">
                Compartilhado por:
                {" "}
                {share.user}
              </p>

              <p className="share-permission">

                {
                  share.can_edit
                    ? "Pode editar"
                    : "Somente leitura"
                }

              </p>

              <div className="share-actions">

                <button
                  onClick={() =>
                    acceptShare(share.id)
                  }
                  className="accept-button"
                >
                  Aceitar
                </button>

                <button
                  onClick={() =>
                    declineShare(share.id)
                  }
                  className="decline-button"
                >
                  Recusar
                </button>

              </div>

            </div>

          ))
        }

      </section>

      <section className="received-section">

        <h2 className="section-title">
          Tarefas aceitas
        </h2>

        {
          acceptedShares.length === 0 && (
            <p>Nenhuma tarefa aceita.</p>
          )
        }

        {
          acceptedShares.map((share) => (

            <div
              key={share.id}
              className="share-card"
            >

              <h3 className="share-task-title">
                {share.task.title}
              </h3>

              <p className="share-description">
                {share.task.description}
              </p>

              <p className="share-owner">
                Compartilhado por:
                {" "}
                {share.user}
              </p>

              <p className="share-permission">

                {
                  share.can_edit
                    ? "Pode editar"
                    : "Somente leitura"
                }

              </p>

            </div>

          ))
        }

      </section>

    </main>

  </div>
)}

export default ReceivedSharesPage