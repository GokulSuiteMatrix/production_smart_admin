import { Navigate } from "react-router-dom"
import { useMsal } from "@azure/msal-react"
import PropTypes from "prop-types"

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  const { accounts } = useMsal()
  const user = accounts[0]

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // For testing purposes, let's assume all users have access for now
  // You'll need to implement proper role checking based on your user data structure
  return Element
}

RoleBasedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default RoleBasedRoute
