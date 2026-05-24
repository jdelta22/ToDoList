import { useState } from "react"

import "../../styles/task-form.css"

function TaskForm({
  onCreate,
  categories,
}) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])

  function toggleCategory(categoryId) {
    setSelectedCategories((prev) => {

      if (prev.includes(categoryId)) {

        return prev.filter(
          (id) => id !== categoryId
        )
      }

      return [...prev, categoryId]
    })
  }

  function handleSubmit(e) {

    e.preventDefault()

    if (!title.trim()) return

    onCreate({
      title,
      description,
      category_ids: selectedCategories,
    })

    setTitle("")
    setDescription("")
    setSelectedCategories([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form"
    >

      <div className="form-group">

        <label className="form-label">
          Título
        </label>

        <input
          type="text"
          placeholder="Digite o título da tarefa"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="task-input"
        />

      </div>

      <div className="form-group">

        <label className="form-label">
          Descrição
        </label>

        <textarea
          placeholder="Descrição da tarefa"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="task-textarea"
        />

      </div>

      <div className="form-group">

        <label className="form-label">
          Categorias
        </label>

        <div className="categories-container">

          {categories?.map((category) => {

            const selected =
              selectedCategories.includes(category.id)

            return (

              <button
                type="button"
                key={category.id}

                onClick={() => toggleCategory(category.id)}

                className={`category-option ${
                  selected
                    ? "category-selected"
                    : ""
                }`}
              >
                {category.name}
              </button>

            )
          })}

        </div>

      </div>

      <button className="task-button">
        Criar tarefa
      </button>

    </form>
  )
}

export default TaskForm