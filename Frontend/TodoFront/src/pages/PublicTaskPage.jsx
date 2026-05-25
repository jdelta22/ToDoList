import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import api from "../services/api"

import "../styles/public-task.css"

function PublicTaskPage() {

  const { share_code } = useParams()

  const [task, setTask] = useState(null)

  const [loading, setLoading] = useState(true)

  async function fetchTask() {

    try {

      const response = await api.get(
        `/public/tasks/${share_code}/`
      )

      setTask(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  async function cloneTask() {

    try {

      await api.post(
        `/public/tasks/${share_code}/clone/`
      )

      alert("Tarefa clonada")

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchTask()

  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!task) {
    return <p>Tarefa não encontrada.</p>
  }

  return (
    <div className="public-task-container">

      <div className="public-task-card">

        <h1 className="public-task-title">
          {task.title}
        </h1>

        {task.description && (

          <p className="public-task-description">
            {task.description}
          </p>

        )}

        {task.categories.length > 0 && (

          <div className="public-task-categories">

            {task.categories.map((category) => (

              <span
                key={category.id}
                className="public-category-badge"
                style={{
                  backgroundColor: category.color
                }}
              >
                {category.name}
              </span>

            ))}

          </div>

        )}

        <button
          onClick={cloneTask}
          className="clone-button"
        >
          Clonar tarefa
        </button>

      </div>

    </div>
  )
}

export default PublicTaskPage