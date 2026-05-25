import "../../styles/task-card.css"

function TaskCard({
  task,
  onDelete,
  onToggle,
  onEdit,
  onShare,
}) {

  const completedStatus = task.is_owner
    ? task.completed
    : task.share_completed

  return (
    <div className="task-card">

      <div className="task-header">

        <div>

          <h2
            className={`task-title ${
              completedStatus
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

          {completedStatus ? (
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

      {!task.is_owner && (
        <div className="shared-info">

          <span className="shared-badge">
            Compartilhada com você
          </span>

          <span className="permission-badge">

            {task.can_edit
              ? "Pode editar"
              : "Somente leitura"}

          </span>

        </div>
      )}

      <div className="task-actions">

        <button
          onClick={() => onToggle(task)}
          className="complete-button"
        >
          {completedStatus
            ? "Desfazer"
            : "Concluir"}
        </button>

        {(task.is_owner || task.can_edit) && (
          <button
            onClick={() => onEdit(task)}
            className="edit-button"
          >
            Editar
          </button>
        )}

        {task.is_owner && (
          <button
            onClick={() => onShare(task)}
            className="share-button"
          >
            Compartilhar
          </button>
        )}

        {task.is_owner && (
          <button
            onClick={() =>
              onDelete(task.id)
            }
            className="delete-button"
          >
            Excluir
          </button>
        )}

      </div>

    </div>
  )
}

export default TaskCard