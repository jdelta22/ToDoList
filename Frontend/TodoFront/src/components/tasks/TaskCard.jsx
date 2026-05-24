import "../../styles/task-card.css"

function TaskCard({
  task,
  onDelete,
  onToggle,
  onEdit,
}) {

  return (
    <div className="task-card">

      <div className="task-header">

        <div>

          <h2
            className={`task-title ${
              task.completed
                ? "task-completed"
                : ""
            }`}
          >
            {task.title}
          </h2>

          {task.description && (
            <p className="task-description">
              {task.description}
            </p>
          )}

        </div>

        <div className="task-status">

          {task.completed ? (
            <span className="status-completed">
              Concluída
            </span>
          ) : (
            <span className="status-pending">
              Pendente
            </span>
          )}

        </div>

      </div>

      {task.categories.length > 0 && (

        <div className="task-categories">

          {task.categories.map((category) => (

            <span
              key={category.id}
              className="category-badge"
              style={{
                backgroundColor: category.color
              }}
            >
              {category.name}
            </span>

          ))}

        </div>

      )}

      <div className="task-actions">

        <button
          onClick={() =>
            onToggle(
              task.id,
              task.completed
            )
          }
          className="complete-button"
        >
          {task.completed
            ? "Desfazer"
            : "Concluir"}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="edit-button"
        >
          Editar
        </button>

        <button className="share-button">
          Compartilhar
        </button>

        <button
          onClick={() =>
            onDelete(task.id)
          }
          className="delete-button"
        >
          Excluir
        </button>

      </div>

    </div>
  )
}

export default TaskCard