import { useState, useEffect, useCallback } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import GardenFormModal from "../components/GardenFormModal.jsx";
import "./GardensPage.css";

// Aleena — the garden management UI. This is my full-CRUD collection:
//   Create  -> POST   /api/gardens
//   Read    -> GET    /api/gardens
//   Update  -> PUT    /api/gardens/:id
//   Delete  -> DELETE /api/gardens/:id
export default function GardensPage() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); 

  const loadGardens = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/gardens");
    if (res.ok) {
      const data = await res.json();
      setGardens(data.gardens);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGardens();
  }, [loadGardens]);

  const saveGarden = async ({ name, type }) => {
    const url = editing ? `/api/gardens/${editing._id}` : "/api/gardens";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Could not save garden");
    }
    await loadGardens();
  };

  const deleteGarden = async (garden) => {
    const ok = window.confirm(
      `Delete "${garden.name}" and everything planted in it?`
    );
    if (!ok) return;
    const res = await fetch(`/api/gardens/${garden._id}`, { method: "DELETE" });
    if (res.ok) await loadGardens();
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (garden) => {
    setEditing(garden);
    setModalOpen(true);
  };

  return (
    <div className="gb-gardens">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2 className="mb-0">My Gardens</h2>
        <Button className="btn-gb-primary" onClick={openCreate}>
          + New garden
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : gardens.length === 0 ? (
        <p className="text-body-secondary">
          No gardens yet. Create one to start planning your plantings.
        </p>
      ) : (
        <Row className="g-3">
          {gardens.map((garden) => (
            <Col md={4} sm={6} key={garden._id}>
              <Card className="h-100 gb-garden-card">
                <Card.Body>
                  <span
                    className="gb-type-dot"
                    style={{ backgroundColor: `var(--gb-${garden.type})` }}
                  />
                  <Card.Title className="fs-5">{garden.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-body-secondary text-capitalize">
                    {garden.type}
                  </Card.Subtitle>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => openEdit(garden)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteGarden(garden)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <GardenFormModal
        show={modalOpen}
        garden={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={saveGarden}
      />
    </div>
  );
}
