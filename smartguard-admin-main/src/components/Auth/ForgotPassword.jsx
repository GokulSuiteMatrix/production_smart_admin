"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {useMsal } from "@azure/msal-react"
import { useTheme } from "../../contexts/ThemeContext"
import { Sun, Moon, Shield, ArrowLeft, Mail } from "lucide-react"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { resetPassword } = useMsal()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (!email) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    const result = resetPassword(email)

    if (result.success) {
      setMessage(result.message)
      setSubmitted(true)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
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
                    {submitted ? (
                      <Mail size={48} className="text-success" />
                    ) : (
                      <Shield size={48} className="text-primary" />
                    )}
                  </div>
                  <h2 className="fw-bold mb-2">{submitted ? "Check Your Email" : "Reset Password"}</h2>
                  <p className="text-muted">
                    {submitted
                      ? "We've sent a password reset link to your email"
                      : "Enter your email to receive reset instructions"}
                  </p>
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

                {message && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="alert alert-success"
                  >
                    {message}
                  </motion.div>
                )}

                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="mb-3"
                    >
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="d-grid mb-3"
                    >
                      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Sending...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>

                    </motion.div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center mb-3"
                  >
                    <p className="mb-3">
                      If an account with that email exists, you'll receive a password reset link shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setEmail("")
                        setMessage("")
                      }}
                      className="btn btn-outline-primary"
                    >
                      Send Another Email
                    </button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-center"
                >
                  <Link to="/login" className="text-decoration-none d-inline-flex align-items-center">
                    <ArrowLeft size={16} className="me-2" />
                    Back to Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
