import { useEffect, useState } from "react"

import api from "../services/api"

import Sidebar from "../components/layout/Sidebar"
import TaskFilters from "../components/tasks/TaskFilters"
import TaskPagination from "../components/tasks/TaskPagination"

function ReceivedTasks() {

  const [shares, setShares] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")
  const [ordering, setOrdering] = useState("-created_at")

  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  })

  useEffect(() => {
    fetchShares()
    fetchCategories()
  }, [
    search,
    status,
    category,
    ordering,
    page,
  ])

  async function fetchCategories() {

    try {

      const response = await api.get(
        "/categories/"
      )

      setCategories(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  async function fetchShares() {

    try {

      let url = `/received-shares/?page=${page}`

      if (search) {
        url += `&search=${search}`
      }

      if (status !== "all") {
        url += `&completed=${status}`
      }

      if (category !== "all") {
        url += `&task__categories=${category}`
      }

      if (ordering) {
        url += `&ordering=${ordering}`
      }

      const response = await api.get(url)

      setShares(response.data.results)

      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      })

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

      fetchShares()

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

        <TaskFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          ordering={ordering}
          setOrdering={setOrdering}
          categories={categories}
        />

        <div className="tasks-container">

          {shares.map((share) => (

            <div
              key={share.id}
              className="bg-white rounded-2xl shadow p-5 border border-gray-100"
            >

              <div className="flex items-start justify-between mb-3">

                <div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    {share.task.title}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Compartilhado por {share.task.owner}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    share.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {share.completed
                    ? "Concluída"
                    : "Pendente"}
                </span>

              </div>

              <p className="text-gray-600 mb-4">
                {share.task.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">

                {share.task.categories.map((category) => (

                  <span
                    key={category.id}
                    className="text-white text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: category.color
                    }}
                  >
                    {category.name}
                  </span>

                ))}

              </div>

              <div className="flex flex-wrap gap-2 mb-4">

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {share.can_edit
                    ? "Pode editar"
                    : "Somente leitura"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    share.accepted === true
                      ? "bg-green-100 text-green-700"
                      : share.accepted === false
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {share.accepted === true && "Aceito"}
                  {share.accepted === false && "Recusado"}
                  {share.accepted === null && "Pendente"}
                </span>

              </div>

              <div className="flex gap-3 flex-wrap">

                {share.accepted === null && (
                  <>
                    <button
                      onClick={() =>
                        acceptInvite(share.id)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Aceitar
                    </button>

                    <button
                      onClick={() =>
                        declineInvite(share.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Recusar
                    </button>
                  </>
                )}

                {share.accepted === true && (
                  <button
                    onClick={() =>
                      toggleComplete(share.id)
                    }
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      share.completed
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {share.completed
                      ? "Desfazer"
                      : "Concluir"}
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

        <TaskPagination
          pagination={pagination}
          page={page}
          setPage={setPage}
        />

      </main>

    </div>
  )
}

export default ReceivedTasks