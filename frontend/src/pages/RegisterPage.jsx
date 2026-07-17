import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/AuthContext.jsx";

const DEFAULT_FORM = { displayName: "", email: "", password: "", zip: "" };

export default function RegisterPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/mygarden");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="gb-auth-form">
      <h2 className="text-center">Register</h2>
      {error && <p className="text-danger">{error}</p>}

      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          placeholder="Enter your name"
          value={form.displayName}
          onChange={onChange("displayName")}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={onChange("email")}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange("password")}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>ZIP code</Form.Label>
        <Form.Control
          placeholder="02116"
          value={form.zip}
          onChange={onChange("zip")}
          required
        />
        <Form.Text>We use this to find your USDA zone and frost dates.</Form.Text>
      </Form.Group>

      <div className="text-center">
        <Button
          className="me-2 btn-gb-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Register"}
        </Button>
      </div>
      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Form>
  );
}
