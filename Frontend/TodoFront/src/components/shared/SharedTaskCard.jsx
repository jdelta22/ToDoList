import "../../styles/shared-task-card.css"

import api from "../../services/api"

function SharedTaskCard({ task }) {

    async function revokeShare(shareId) {
        try {
            await api.delete(
                `/shares/${shareId}/`
            )
            loadTasks()
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className="shared-card">

            <div className="shared-header">

                <h2>{task.title}</h2>

                <span
                    className={
                        task.is_public
                        ? "public-badge"
                        : "private-badge"
                    }
                >
                    {
                        task.is_public
                        ? "Pública"
                        : "Privada"
                    }
                </span>

            </div>

            <p className="shared-description">
                {task.description}
            </p>

            <div className="categories-container">

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

            <div className="shared-users-section">

                <h3>
                    Usuários compartilhados
                </h3>

                {
                    task.users.length === 0
                    ? (
                        <p>
                            Nenhum usuário
                        </p>
                    )
                    : (
                        task.users.map((user) => (

                            <div
                                key={user.id}
                                className="shared-user-row"
                            >

                                <span>
                                    @{user.username}
                                </span>

                                <div className="user-badges">

                                    {
                                        user.can_edit && (
                                            <span className="edit-badge">
                                                Pode editar
                                            </span>
                                        )
                                    }

                                    {
                                        user.accepted === true && (
                                            <span className="accepted-badge">
                                                Aceito
                                            </span>
                                        )
                                    }

                                    {
                                        user.accepted === null && (
                                            <span className="pending-badge">
                                                Pendente
                                            </span>
                                        )
                                    }

                                    {
                                        user.completed && (
                                            <span className="completed-badge">
                                                Concluiu
                                            </span>
                                        )
                                    }
                                    {
                                        !user.completed && (
                                            <span className="not-completed-badge">
                                                Não concluiu
                                            </span>
                                        )
                                    }

                                    <button
                                        onClick={() =>
                                            revokeShare(user.id)
                                        }
                                        className="revoke-button"
                                    >
                                        Revogar
                                    </button>

                                </div>

                            </div>

                        ))
                    )
                }

            </div>

        </div>
    )
}

export default SharedTaskCard