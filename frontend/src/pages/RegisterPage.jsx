import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Aleena — register with displayName + zip (region).
const DEFAULT_FORM = { displayName: "", email: "", password: "", zip: "" };

export default function RegisterPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Registration failed");
      return;
    }

    // Aleena: auto-login after register, or send to /login
    navigate("/login");
  };

  return (
    <Form onSubmit={onSubmit}>
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}

      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control placeholder="Enter your name" value={form.displayName} onChange={onChange("displayName")} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={form.email} onChange={onChange("email")} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={form.password} onChange={onChange("password")} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>ZIP code</Form.Label>
        <Form.Control placeholder="02116" value={form.zip} onChange={onChange("zip")} />
        <Form.Text>We use this to find your USDA zone and frost dates.</Form.Text>
      </Form.Group>

      <div>
        <Button className="me-2 btn-gb-primary" type="submit">
          Register
        </Button>
      </div>
      <div className="mt-2">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Form>
  );
}
