import { useEffect, useState } from "react"

import "../../styles/edit-category-modal.css"

function EditCategoryModal({
  category,
  onClose,
  onSave,
}) {

  const [name, setName] = useState("")
  const [color, setColor] = useState("#3B82F6")

  useEffect(() => {

    if (category) {

      setName(category.name)
      setColor(category.color)
    }

  }, [category])

  if (!category) return null

  async function handleSubmit(e) {

    e.preventDefault()

    await onSave({
      id: category.id,
      name,
      color,
    })
  }

  return (
    <div className="edit-category-overlay">

      <div className="edit-category-modal">

        <h2 className="edit-category-title">
          Editar categoria
        </h2>

        <form
          onSubmit={handleSubmit}
          className="edit-category-form"
        >

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nome da categoria"
            className="edit-category-input"
          />

          <input
            type="color"
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
            className="edit-category-color"
          />

          <div className="edit-category-actions">

            <button
              type="submit"
              className="edit-category-save"
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="edit-category-cancel"
            >
              Cancelar
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default EditCategoryModal