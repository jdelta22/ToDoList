import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import SharedTasks from "./pages/SharedTasks"
import ReceivedTasks from "./pages/ReceivedTasks"


import PrivateRoute from "./routes/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route
          path="/shared"
          element={
            <PrivateRoute>
              <SharedTasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/received"
          element={
            <PrivateRoute>
              <ReceivedTasks />
            </PrivateRoute>
          }
        />

      </Routes>
      
    </BrowserRouter>
  )
}

export default App