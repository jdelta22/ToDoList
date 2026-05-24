import "../../styles/pagination.css"

function TaskPagination({
  pagination,
  page,
  setPage,
}) {

  return (
    <div className="pagination-container">

      <button
        disabled={!pagination.previous}
        onClick={() =>
          setPage((prev) => prev - 1)
        }
        className="pagination-button"
      >
        Anterior
      </button>

      <span className="pagination-page">
        Página {page}
      </span>

      <button
        disabled={!pagination.next}
        onClick={() =>
          setPage((prev) => prev + 1)
        }
        className="pagination-button"
      >
        Próxima
      </button>

    </div>
  )
}

export default TaskPagination