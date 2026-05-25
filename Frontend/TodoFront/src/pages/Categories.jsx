import { useEffect, useState } from "react"

import Sidebar from "../components/layout/Sidebar"

import CategoryForm from "../components/categories/CategoryForm"
import CategoryCard from "../components/categories/CategoryCard"
import EditCategoryModal from "../components/categories/EditCategoryModal"

import api from "../services/api"

import "../styles/dashboard.css"
import "../styles/categories.css"

function Categories() {

  const [categories, setCategories] = useState([])

  const [editingCategory, setEditingCategory] =
    useState(null)

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

  useEffect(() => {
    fetchCategories()
  }, [])

  async function createCategory(data) {

    try {

      const response = await api.post(
        "/categories/",
        data
      )

      setCategories((prev) => [
        response.data,
        ...prev,
      ])

    } catch (error) {
      console.log(error)
    }
  }

  async function updateCategory(data) {

    try {

      const response = await api.patch(
        `/categories/${data.id}/`,
        data
      )

      setCategories((prev) =>
        prev.map((category) =>
          category.id === data.id
            ? response.data
            : category
        )
      )

      setEditingCategory(null)

    } catch (error) {
      console.log(error)
    }
  }

  async function deleteCategory(id) {

    try {

      await api.delete(
        `/categories/${id}/`
      )

      setCategories((prev) =>
        prev.filter(
          (category) => category.id !== id
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
          Categorias
        </h1>

        <CategoryForm
          onCreate={createCategory}
        />

        <EditCategoryModal
          category={editingCategory}
          onClose={() =>
            setEditingCategory(null)
          }
          onSave={updateCategory}
        />

        <div className="categories-grid">

          {categories.map((category) => (

            <CategoryCard
              key={category.id}
              category={category}
              onEdit={setEditingCategory}
              onDelete={deleteCategory}
            />

          ))}

        </div>

      </main>

    </div>
  )
}

export default Categories