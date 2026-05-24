import { useEffect, useState } from "react"

import Sidebar from "../components/layout/Sidebar"
import TaskForm from "../components/tasks/TaskForm"
import TaskCard from "../components/tasks/TaskCard"
import EditTaskModal from "../components/tasks/EditTaskModal"
import TaskFilters from "../components/tasks/TaskFilters"
import TaskPagination from "../components/tasks/TaskPagination"

import api from "../services/api"

import "../styles/dashboard.css"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [editingTask, setEditingTask] = useState(null)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

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

  async function updateTask(taskData) {
    try {

      const response = await api.patch(
        `/tasks/${taskData.id}/`,
        taskData
      )

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskData.id
            ? response.data
            : task
        )
      )

      setEditingTask(null)

    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTasks() {
    try {

      let url = `/tasks/?page=${page}`

      if (search) {
        url += `&search=${search}`
      }

      if (status !== "all") {
        url += `&completed=${status}`
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

  useEffect(() => {
    fetchTasks()
    fetchCategories()
  }, [search, status, page])

  async function createTask(taskData) {

    try {

      const response = await api.post(
        "/tasks/",
        taskData
      )

      setTasks((prev) => [response.data, ...prev])

    } catch (error) {
      console.log(error)
    }
  }

  async function deleteTask(id) {

    try {

      await api.delete(`/tasks/${id}/`)

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      )

    } catch (error) {
      console.log(error)
    }
  }

  async function toggleTask(id, completed) {

    try {

      const response = await api.patch(`/tasks/${id}/`, {
        completed: !completed,
      })

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? response.data : task
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
          Minhas tarefas
        </h1>

        <TaskForm onCreate={createTask} categories={categories} />

        <EditTaskModal
          task={editingTask}
          categories={categories}
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
        />

        <TaskFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <div className="tasks-container">

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={setEditingTask}
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

export default Dashboard