import Sidebar from "../components/layout/Sidebar"

function SharedTasks() {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold">
          Tarefas compartilhadas
        </h1>

      </main>

    </div>
  )
}

export default SharedTasks