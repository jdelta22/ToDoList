import Sidebar from "../components/Sidebar.jsx"

function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Minhas tarefas
        </h1>

      </main>

    </div>
  )
}

export default Dashboard