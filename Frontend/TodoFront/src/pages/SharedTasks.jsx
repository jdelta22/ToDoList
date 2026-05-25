import { useEffect, useState } from "react"
import api from "../services/api"

import Sidebar from "../components/layout/Sidebar"
import SharedTaskCard from "../components/shared/SharedTaskCard"

import "../styles/shared-page.css"

function SharedPage() {

    const [tasks, setTasks] = useState([])

    async function loadTasks() {

        try {

            const response = await api.get(
                "/shares/"
            )

            setTasks(response.data.results)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    return (
        <div className="dashboard-container">

            <Sidebar />

            <main className="dashboard-content">

                <h1 className="dashboard-title">
                    Compartilhadas por mim
                </h1>

                <div className="shared-tasks-container">

                    {tasks.map((task) => (
                        <SharedTaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}

                </div>

            </main>

        </div>
    )
}

export default SharedPage