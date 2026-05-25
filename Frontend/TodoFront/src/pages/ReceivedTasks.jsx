import { useEffect, useState } from "react"

import api from "../services/api"

import Sidebar from "../components/layout/Sidebar"

import "../styles/dashboard.css"
import "../styles/received-shares.css"

function ReceivedShares() {

  const [shares, setShares] = useState([])

  useEffect(() => {
    fetchShares()
  }, [])

  async function fetchShares() {

    try {

      const response = await api.get(
        "/received-shares/"
      )

      setShares(response.data.results)

    } catch (error) {
      console.log(error)
    }
  }

  async function acceptInvite(id) {

    try {

      await api.post(
        `/received-shares/${id}/accept/`
      )

      fetchShares()

    } catch (error) {
      console.log(error)
    }
  }

  async function declineInvite(id) {

    try {

      await api.post(
        `/received-shares/${id}/decline/`
      )

      fetchShares()

    } catch (error) {
      console.log(error)
    }
  }

  async function toggleComplete(shareId) {

    try {

      await api.patch(
        `/received-shares/${shareId}/toggle-complete/`
      )

      setShares((prevShares) =>
        prevShares.map((share) =>
          share.id === shareId
            ? {
                ...share,
                completed: !share.completed,
              }
            : share
        )
      )

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="dashboard-content">

        <h1 className="dashboard-title">
          Compartilhadas comigo
        </h1>

        <div className="tasks-container">

          {shares.map((share) => (

            <div
              key={share.id}
              className="task-card"
            >

              <div className="task-header">

                <h2 className="task-title">
                  {share.task.title}
                </h2>

                <span className="share-owner">
                  {share.user}
                </span>

              </div>

              <p className="task-description">
                {share.task.description}
              </p>

              <div className="task-categories">

                {share.task.categories.map((category) => (

                  <span
                    key={category.id}
                    className="category-badge"
                    style={{
                      backgroundColor: category.color
                    }}
                  >
                    {category.name}
                  </span>

                ))}

              </div>

              <div className="share-info">

                <p>
                  Permissão:
                  {" "}
                  {share.can_edit
                    ? "Edição"
                    : "Somente leitura"}
                </p>

                <p>
                  Status convite:
                  {" "}

                  {share.accepted === null && "Pendente"}
                  {share.accepted === true && "Aceito"}
                  {share.accepted === false && "Recusado"}

                </p>

              </div>

              <div className="task-actions">

                {share.accepted === null && (
                  <>
                    <button
                      onClick={() =>
                        acceptInvite(share.id)
                      }
                      className="accept-button"
                    >
                      Aceitar
                    </button>

                    <button
                      onClick={() =>
                        declineInvite(share.id)
                      }
                      className="decline-button"
                    >
                      Recusar
                    </button>
                  </>
                )}

                {share.accepted === true && (
                  <label className="complete-checkbox">

                    <input
                      type="checkbox"
                      checked={share.completed}
                      onChange={() =>
                        toggleComplete(share.id)
                      }
                    />

                    Concluída

                  </label>
                )}

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default ReceivedShares