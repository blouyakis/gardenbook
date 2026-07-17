import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
