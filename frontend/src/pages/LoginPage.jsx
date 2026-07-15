import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/AuthContext.jsx";

// Aleena — login via the shared auth context. On success the context
// holds the user, so the navbar updates without a page reload.
export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(credentials.email, credentials.password);
      navigate("/mygarden");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="gb-auth-form">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}

      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
      </Form.Group>

      <div>
        <Button
          className="me-2 btn-gb-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Logging in…" : "Login"}
        </Button>
        <Button as={Link} to="/register" variant="secondary">
          Register
        </Button>
      </div>
    </Form>
  );
}
