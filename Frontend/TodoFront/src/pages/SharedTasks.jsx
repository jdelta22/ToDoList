import { useEffect, useState } from "react"

import api from "../services/api"

import Sidebar from "../components/layout/Sidebar"
import SharedTaskCard from "../components/shared/SharedTaskCard"
import TaskFilters from "../components/tasks/TaskFilters"
import TaskPagination from "../components/tasks/TaskPagination"

function SharedTasks() {

  const [tasks, setTasks] = useState([])
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

  async function fetchCategories() {

    try {

      const response = await api.get("/categories/")

      setCategories(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTasks() {

    try {

      let url = `/shares/?page=${page}`

      if (search) {
        url += `&search=${search}`
      }

      if (status !== "all") {
        url += `&shares__completed=${status}`
      }

      if (category !== "all") {
        url += `&categories=${category}`
      }

      if (ordering) {
        url += `&ordering=${ordering}`
      }

      const response = await api.get(url)

      setTasks(response.data.results)

      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      })

    } catch (error) {
      console.log(error)
    }
  }

  const handleRevoke = async (taskId, shareId) => {
  try {
    await api.delete(
      `/tasks/${taskId}/shares/${shareId}/revoke/`
    )

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              users: task.users.filter(
                share => share.id !== shareId
              )
            }
          : task
      )
    )

  } catch (err) {
    console.error(err)
  }}

  useEffect(() => {

    fetchTasks()
    fetchCategories()

  }, [
    search,
    status,
    category,
    ordering,
    page,
  ])

  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="dashboard-content">

        <h1 className="dashboard-title">
          Compartilhadas por mim
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

        <div className="shared-tasks-container">

          {tasks.map((task) => (
            <SharedTaskCard
              key={task.id}
              task={task}
              onRevoke={handleRevoke}
            />
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

export default SharedTasks