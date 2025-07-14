import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { useMsal } from "@azure/msal-react"
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup"
import ForgotPassword from "./components/Auth/ForgotPassword"
import Dashboard from "./components/Dashboard/Dashboard"
import { useEffect } from "react"
import Navbar from "./components/Dashboard/Navbar";
import PageHeader from "./components/Dashboard/PageHeader";

function App() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    console.log("App component - Accounts:", accounts);
    if (accounts.length > 0) {
      instance
        .acquireTokenSilent({
          scopes: ["User.Read"], // or your actual scopes from loginRequest
          account: accounts[0]
        })
        .then((response) => {
          console.log("Access Token from App:", response.accessToken);
        })
        .catch((error) => {
          console.error("Token acquisition failed in App", error);
        });
    }
  }, [accounts, instance]);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          
          
          <main>
            <Routes>
              <Route path="/login" element={
                accounts.length > 0 ? <Navigate to="/dashboard" replace /> : <Login />
              } />
              <Route path="/signup" element={
                accounts.length > 0 ? <Navigate to="/dashboard" replace /> : <Signup />
              } />
              <Route path="/forgot-password" element={
                accounts.length > 0 ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
              } />
              <Route path="/dashboard/*" element={
                accounts.length === 0 ? <Navigate to="/login" replace /> : <Dashboard />
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
