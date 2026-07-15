import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// TEST SCAFFOLD (Barbara's component) — Aleena wired the three data calls so
// the add-to-garden loop works end to end for testing:
//   GET  /api/plants/:id            -> plant summary + windows
//   GET  /api/gardens               -> garden <select>
//   POST /api/gardens/:id/plantings -> add the planting
// Barbara owns the real detail rendering (when-to-plant windows, etc.).
export default function PlantDetailModal({ plantId, onClose }) {
  const [plant, setPlant] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [form, setForm] = useState({ gardenId: "", plantedDate: "" });
  const [error, setError] = useState(null);

  // Load the plant's detail whenever a plant is selected.
  useEffect(() => {
    if (!plantId) {
      setPlant(null);
      return;
    }
    setError(null);
    (async () => {
      const res = await fetch(`/api/plants/${plantId}`);
      if (res.ok) setPlant(await res.json());
    })();
  }, [plantId]);

  // Load the user's gardens for the dropdown.
  useEffect(() => {
    if (!plantId) return;
    (async () => {
      const res = await fetch("/api/gardens");
      if (res.ok) setGardens((await res.json()).gardens);
    })();
  }, [plantId]);

  const onAdd = async (evt) => {
    evt.preventDefault();
    setError(null);
    const res = await fetch(`/api/gardens/${form.gardenId}/plantings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantId, plantedDate: form.plantedDate }),
    });
    if (res.ok) {
      setForm({ gardenId: "", plantedDate: "" });
      onClose();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Could not add planting");
    }
  };

  return (
    <Modal show={!!plantId} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{plant?.commonName || "Plant Detail"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!plant ? (
          <p className="text-body-secondary">Loading...</p>
        ) : (
          <>
            <p>{plant.summary}</p>
            {plant.windows?.length > 0 && (
              <p className="small text-body-secondary mb-0">
                When to plant ({plant.method}):{" "}
                {plant.windows
                  .map((w) =>
                    w.startDate ? `${w.startDate} → ${w.endDate}` : w.method
                  )
                  .join(", ")}
              </p>
            )}
          </>
        )}
        {error && <p className="text-danger mt-2 mb-0">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Form onSubmit={onAdd} className="d-flex gap-2 w-100">
          <Form.Select
            value={form.gardenId}
            onChange={(e) => setForm({ ...form, gardenId: e.target.value })}
            required
          >
            <option value="">Select a garden</option>
            {gardens.map((garden) => (
              <option key={garden._id} value={garden._id}>
                {garden.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control
            type="date"
            value={form.plantedDate}
            onChange={(e) => setForm({ ...form, plantedDate: e.target.value })}
            required
            style={{ maxWidth: "11rem" }}
          />
          <Button type="submit" variant="gb-primary">
            Add to garden
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
}

PlantDetailModal.propTypes = {
  plantId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func.isRequired,
};

PlantDetailModal.defaultProps = {
  plantId: null,
};
