import { useEffect, useState } from "react"

import "../../styles/modal.css"

function EditTaskModal({
  task,
  categories,
  onClose,
  onSave,
}) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {

    if (task) {

      setTitle(task.title)

      setDescription(task.description)

      setSelectedCategories(
        task.categories.map(
          (category) => category.id
        )
      )
    }

  }, [task])

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

    onSave({
      ...task,
      title,
      description,
      category_ids: selectedCategories,
    })
  }

  if (!task) return null

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h2 className="modal-title">
          Editar tarefa
        </h2>

        <form
          onSubmit={handleSubmit}
          className="modal-form"
        >

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="modal-input"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="modal-textarea"
          />

          <div className="categories-container">

            {categories.map((category) => {

              const selected =
                selectedCategories.includes(
                  category.id
                )

              return (

                <button
                  type="button"
                  key={category.id}

                  onClick={() =>
                    toggleCategory(category.id)
                  }

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

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancelar
            </button>

            <button className="save-button">
              Salvar
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default EditTaskModal