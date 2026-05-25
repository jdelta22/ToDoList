import { useEffect, useState } from "react"

import api from "../services/api"

import Sidebar from "../components/layout/Sidebar"

import "../styles/dashboard.css"

function ReceivedTasks() {

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
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    {share.task.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {share.task.description}
                  </p>

                </div>

                <div>

                  {share.completed ? (

                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      Concluída
                    </span>

                  ) : (

                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                      Pendente
                    </span>

                  )}

                </div>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {share.task.categories.map((category) => (

                  <span
                    key={category.id}
                    className="text-white text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: category.color
                    }}
                  >
                    {category.name}
                  </span>

                ))}

              </div>

              <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">

                <p>
                  Compartilhado por:
                  {" "}
                  <strong>{share.user}</strong>
                </p>

                <p>
                  Permissão:
                  {" "}

                  <strong>
                    {share.can_edit
                      ? "Edição"
                      : "Somente leitura"}
                  </strong>

                </p>

                <p>
                  Status:
                  {" "}

                  <strong>

                    {share.accepted === null &&
                      "Pendente"}

                    {share.accepted === true &&
                      "Aceito"}

                    {share.accepted === false &&
                      "Recusado"}

                  </strong>

                </p>

              </div>

              <div className="mt-5 flex flex-wrap gap-3 items-center">

                {share.accepted === null && (
                  <>
                    <button
                      onClick={() =>
                        acceptInvite(share.id)
                      }
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition font-medium"
                    >
                      Aceitar
                    </button>

                    <button
                      onClick={() =>
                        declineInvite(share.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition font-medium"
                    >
                      Recusar
                    </button>
                  </>
                )}

                {share.accepted === true && (

                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">

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

export default ReceivedTasks