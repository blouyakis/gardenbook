import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

// Aleena — route guard. Wrap protected pages with this so an unauthenticated
// visitor is bounced to /login instead of hitting a page that will just 401.
// While the initial session check is in flight we render nothing to avoid a
// flash of the login page for users who are actually signed in.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
