/**
 * frontend/src/components/ProtectedRoute.jsx
 *
 * Auth guard for private routes.
 * If no JWT token is found in localStorage the user is redirected to /login.
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */

import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../services/api'

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login. replace=true prevents the login page from being
    // added to the browser history stack so the user can't click "back" to it.
    return <Navigate to="/login" replace />
  }
  return children
}
