import "../../styles/task-filters.css"

function TaskFilters({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  ordering,
  setOrdering,
  categories,
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

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="filter-select"
      >

        <option value="all">
          Todas categorias
        </option>

        {categories.map((category) => (

          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>

        ))}

      </select>

      <select
        value={ordering}
        onChange={(e) =>
          setOrdering(e.target.value)
        }
        className="filter-select"
      >

        <option value="-created_at">
          Mais recentes
        </option>

        <option value="created_at">
          Mais antigas
        </option>

        <option value="title">
          A-Z
        </option>

        <option value="-title">
          Z-A
        </option>

      </select>

    </div>
  )
}

export default TaskFilters