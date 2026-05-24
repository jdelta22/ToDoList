import { createContext, useState } from "react"

export const AuthContext = createContext()

function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  )

  function login(accessToken) {

    localStorage.setItem("token", accessToken)

    setToken(accessToken)
  }

  function logout() {

    localStorage.removeItem("token")

    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        authenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider