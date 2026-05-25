import { useState } from "react"

import api from "../../services/api"

import "../../styles/import-public-task-modal.css"

function ImportPublicTaskModal({
  onClose,
}) {

  const [link, setLink] = useState("")

  async function importTask() {

    try {

      const shareCode =
        link.split("/share/")[1]

      await api.post(
        `/public/tasks/${shareCode}/clone/`
      )

      alert("Tarefa importada")

      onClose()

    } catch (error) {
      console.log(error)
      alert("Link inválido")
    }
  }

  return (
    <div className="import-modal-overlay">

      <div className="import-modal-content">

        <h2 className="import-modal-title">
          Importar tarefa pública
        </h2>

        <input
          type="text"
          placeholder="Cole o link da tarefa"
          value={link}
          onChange={(e) =>
            setLink(e.target.value)
          }
          className="import-modal-input"
        />

        <div className="import-modal-actions">

          <button
            onClick={onClose}
            className="import-cancel-button"
          >
            Cancelar
          </button>

          <button
            onClick={importTask}
            className="import-confirm-button"
          >
            Importar
          </button>

        </div>

      </div>

    </div>
  )
}

export default ImportPublicTaskModal