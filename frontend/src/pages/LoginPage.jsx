import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Aleena — login via fetch (JSON), not form action, so the SPA
// can react to the result without a full page reload.
export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Login failed");
      return;
    }

    // Aleena: store the user in shared state (context) so the
    // NavigationBar can show login/logout correctly.
    navigate("/mygarden");
  };

  return (
    <Form onSubmit={onSubmit}>
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}

      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
      </Form.Group>

      <div>
        <Button className="me-2 btn-gb-primary" type="submit">
          Login
        </Button>
        <Button as={Link} to="/register" variant="secondary">
          Register
        </Button>
      </div>
    </Form>
  );
}
