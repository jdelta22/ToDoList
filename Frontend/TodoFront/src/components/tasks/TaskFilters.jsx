import "../../styles/task-filters.css"

function TaskFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {

  return (
    <div className="task-filters">

      <input
        type="text"
        placeholder="Pesquisar tarefa..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="filter-input"
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="filter-select"
      >

        <option value="all">
          Todas
        </option>

        <option value="true">
          Concluídas
        </option>

        <option value="false">
          Pendentes
        </option>

      </select>

    </div>
  )
}

export default TaskFilters