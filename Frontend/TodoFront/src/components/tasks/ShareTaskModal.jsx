import { useState, useEffect } from "react"

import api from "../../services/api"

import "../../styles/share-modal.css"

function ShareTaskModal({
  task,
  onClose,
}) {

    const [username, setUsername] = useState("")
    const [canEdit, setCanEdit] = useState(false)
    const [isPublic, setIsPublic] = useState(false)

    useEffect(() => {
        if (task) {
            setIsPublic(task.is_public)
        }
    }, [task])
    if (!task) return null
    

    const publicLink = `http://localhost:5173/share/${task.share_code}`

    async function togglePublic() {

        try {

        const response = await api.post(
            `/public/tasks/${task.share_code}/make-public/`
        )

        setIsPublic(response.data.is_public)

        alert("Visibilidade atualizada")

        } catch (error) {
        console.log(error)
        }
    }

    async function inviteUser() {

        try {

        await api.post(
            `/tasks/${task.id}/invite/`,
            {
            username,
            can_edit: canEdit,
            }
        )

        alert("Convite enviado")

        setUsername("")
        setCanEdit(false)

        } catch (error) {
        console.log(error)
        }
    }

    async function copyLink() {

        await navigator.clipboard.writeText(
        publicLink
        )

        alert("Link copiado")
    }

    if (!task) return null

    return (
        <div className="modal-overlay">

        <div className="modal-content">

            <h2 className="modal-title">
            Compartilhar tarefa
            </h2>

            <div className="share-section">

            <h3 className="section-title">
                Compartilhamento público
            </h3>

            <button
                onClick={togglePublic}
                className="public-button"
            >
                {
                isPublic
                ? "Tornar privada"
                : "Tornar pública"
                }
            </button>
            <p className="public-status">
                {
                    isPublic
                    ? "Essa tarefa está pública"
                    : "Essa tarefa está privada"
                }
            </p>

            <div className="public-link-box">

                <input
                value={publicLink}
                readOnly
                className="public-link-input"
                />

                <button
                onClick={copyLink}
                className="copy-button"
                >
                Copiar
                </button>

            </div>

            </div>

            <div className="share-section">

            <h3 className="section-title">
                Compartilhar com usuário
            </h3>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                setUsername(e.target.value)
                }
                className="modal-input"
            />

            <label className="checkbox-label">

                <input
                type="checkbox"
                checked={canEdit}
                onChange={(e) =>
                    setCanEdit(e.target.checked)
                }
                />

                Permitir edição

            </label>

            <button
                onClick={inviteUser}
                className="invite-button"
            >
                Enviar convite
            </button>

            </div>

            <button
            onClick={onClose}
            className="close-button"
            >
            Fechar
            </button>

        </div>

        </div>
    )
    }

export default ShareTaskModal
