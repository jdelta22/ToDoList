import { useState } from "react"

function CategoryForm({ onCreate }) {

  const [name, setName] = useState("")
  const [color, setColor] = useState("#3B82F6")

  async function handleSubmit(e) {

    e.preventDefault()

    await onCreate({
      name,
      color,
    })

    setName("")
    setColor("#3B82F6")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="category-form"
    >

      <input
        type="text"
        placeholder="Nome da categoria"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="category-input"
      />

      <input
        type="color"
        value={color}
        onChange={(e) =>
          setColor(e.target.value)
        }
        className="category-color-input"
      />

      <button className="category-create-button">
        Criar
      </button>

    </form>
  )
}

export default CategoryForm