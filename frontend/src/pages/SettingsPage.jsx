import { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../context/AuthContext.jsx";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [zip, setZip] = useState(user?.region?.zip ?? "");
  const [profileMsg, setProfileMsg] = useState(null);

  const saveProfile = async (evt) => {
    evt.preventDefault();
    setProfileMsg(null);
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, zip }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setUser(data.user); // keep the navbar greeting + region in sync
      setProfileMsg({ type: "success", text: "Profile updated." });
    } else {
      setProfileMsg({ type: "danger", text: data.message || "Update failed." });
    }
  };

  const [pw, setPw] = useState({ current: "", next: "" });
  const [pwMsg, setPwMsg] = useState(null);

  const changePassword = async (evt) => {
    evt.preventDefault();
    setPwMsg(null);
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pw.current,
        newPassword: pw.next,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPwMsg({ type: "success", text: "Password changed." });
      setPw({ current: "", next: "" });
    } else {
      setPwMsg({ type: "danger", text: data.message || "Change failed." });
    }
  };

  const deleteAccount = async () => {
    const ok = window.confirm(
      "Permanently delete your account and all your gardens? This cannot be undone."
    );
    if (!ok) return;
    const res = await fetch("/api/auth/account", { method: "DELETE" });
    if (res.ok) {
      await logout(); 
      navigate("/");
    }
  };

  const region = user?.region ?? {};

  return (
    <div className="gb-settings">
      <h2 className="my-3">Settings</h2>

      {/* Profile + region */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Profile &amp; region</Card.Title>
          {profileMsg && (
            <Alert variant={profileMsg.type} className="py-2">
              {profileMsg.text}
            </Alert>
          )}
          <Form onSubmit={saveProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Display name</Form.Label>
              <Form.Control
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>ZIP code</Form.Label>
              <Form.Control
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <Form.Text>
                Changing this re-detects your USDA zone and frost dates.
              </Form.Text>
            </Form.Group>
            <p className="text-body-secondary small mb-3">
              Zone: {region.zone || "—"} · Last frost:{" "}
              {region.lastFrost || "—"} · First frost:{" "}
              {region.firstFrost || "—"}
            </p>
            <Button className="btn-gb-primary" type="submit">
              Save profile
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Change password */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Change password</Card.Title>
          {pwMsg && (
            <Alert variant={pwMsg.type} className="py-2">
              {pwMsg.text}
            </Alert>
          )}
          <Form onSubmit={changePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Current password</Form.Label>
              <Form.Control
                type="password"
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                required
              />
            </Form.Group>
            <Button className="btn-gb-primary" type="submit">
              Update password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Danger zone */}
      <Card className="border-danger gb-danger-zone">
        <Card.Body>
          <Card.Title className="text-danger">Delete account</Card.Title>
          <p className="text-body-secondary">
            This removes your account and every garden and planting you own.
          </p>
          <Button variant="danger" onClick={deleteAccount}>
            Delete my account
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
