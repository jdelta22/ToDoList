import { useEffect, useState } from "react"

import Sidebar from "../components/layout/Sidebar"
import TaskForm from "../components/tasks/TaskForm"
import TaskCard from "../components/tasks/TaskCard"
import EditTaskModal from "../components/tasks/EditTaskModal"
import TaskFilters from "../components/tasks/TaskFilters"
import TaskPagination from "../components/tasks/TaskPagination"
import ShareTaskModal from "../components/tasks/ShareTaskModal"

import api from "../services/api"

import "../styles/dashboard.css"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [editingTask, setEditingTask] = useState(null)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("")
  const [ordering, setOrdering] = useState("-created_at")

  const [sharingTask, setSharingTask] = useState(null)

  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  })

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

  async function fetchTasks() {

    try {

      let url = `/tasks/?page=${page}`

      if (search) {
        url += `&search=${search}`
      }
      if (
        category &&
        category !== "all"
      ) {
        url += `&categories=${category}`
      }

      if (ordering) {
        url += `&ordering=${ordering}`
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

  }, [search, status, category, ordering, page,])

  async function createTask(taskData) {
    try {
      await api.post(
        "/tasks/",
        taskData
      )
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  async function updateTask(taskData) {
      try {
        await api.patch(
          `/tasks/${taskData.id}/`,
          taskData
        )
        fetchTasks()
        setEditingTask(null)
      } catch (error) {
        console.log(error)
      }
  }

  async function deleteTask(id) {

    try {

      await api.delete(`/tasks/${id}/`)

      fetchTasks()

    } catch (error) {
      console.log(error)
    }
  }


  async function toggleTask(task) {

    try {

      if (task.share_id) {

        await api.patch(
          `/received-shares/${task.share_id}/toggle-complete/`
        )

      } else {

        await api.patch(
          `/tasks/${task.id}/`,
          {
            completed: !task.completed,
          }
        )

      }

      fetchTasks()

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

        <TaskForm
          onCreate={createTask}
          categories={categories}
        />

        <EditTaskModal
          task={editingTask}
          categories={categories}
          onClose={() =>
            setEditingTask(null)
          }
          onSave={updateTask}
        />

        <ShareTaskModal
          task={sharingTask}
          onClose={() =>
            setSharingTask(null)
          }
        />

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

          statusOptions={[
            {
              value: "all",
              label: "Todas",
            },
            {
              value: "true",
              label: "Concluídas",
            },
            {
              value: "false",
              label: "Pendentes",
            },
          ]}
        />

        <div className="tasks-container">

          {tasks.map((task) => (

            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={setEditingTask}
              onShare={setSharingTask}
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