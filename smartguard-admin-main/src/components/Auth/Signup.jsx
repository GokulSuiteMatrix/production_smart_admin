"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useMsal } from "@azure/msal-react"
import { useTheme } from "../../contexts/ThemeContext"
import { Eye, EyeOff, Sun, Moon, Shield, User } from "lucide-react"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { signup } = useMsal()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    const result = signup(formData.name, formData.email, formData.password)

    if (result.success) {
      navigate("/dashboard")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="auth-card card border-0 rounded-4 p-4"
            >
              <div className="position-absolute top-0 end-0 m-3">
                <button onClick={toggleTheme} className="theme-toggle" type="button">
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>

              <div className="card-body">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-4"
                >
                  <div className="mb-3">
                    <Shield size={48} className="text-primary" />
                  </div>
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join SP Parent Control today</p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="alert alert-danger"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-3"
                  >
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg ps-5"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                      <User className="position-absolute top-50 translate-middle-y ms-3" size={18} />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-3"
                  >
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-3"
                  >
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ border: "none", background: "none" }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mb-3"
                  >
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ border: "none", background: "none" }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="d-grid mb-3"
                  >
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>


                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center"
                  >
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-decoration-none">
                      Sign In
                    </Link>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
