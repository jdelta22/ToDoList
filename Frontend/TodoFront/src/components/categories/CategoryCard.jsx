function CategoryCard({
  category,
  onEdit,
  onDelete,
}) {

  return (
    <div className="category-card">

      <div className="category-header">

        <div className="category-info">

          <div
            className="category-color-preview"
            style={{
              backgroundColor: category.color
            }}
          />

          <h2 className="category-title">
            {category.name}
          </h2>

        </div>

      </div>

      <div className="category-actions">

        <button
          onClick={() => onEdit(category)}
          className="category-edit-button"
        >
          Editar
        </button>

        <button
          onClick={() =>
            onDelete(category.id)
          }
          className="category-delete-button"
        >
          Excluir
        </button>

      </div>

    </div>
  )
}

export default CategoryCard