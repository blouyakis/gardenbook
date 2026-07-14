import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Shows summary + when-to-plant windows, then the add-to-garden flow:
// garden <select> (GET /api/gardens) + date + Add
// (POST /api/gardens/:gardenId/plantings).
export default function PlantDetailModal({ plantId, onClose }) {
  const [plant, setPlant] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [form, setForm] = useState({
    gardenId: "",
    plantedDate: ""
  });

  useEffect(() => {
    if (!plantId) {
      setPlant(null);
      return;
    }
    // Barbara: GET /api/plants/:id -> setPlant
    console.log("🌼 load plant detail", plantId);
  }, [plantId]);

  useEffect(() => {
    if (!plantId) return;
    // Barbara: GET /api/gardens -> setGardens
    console.log("🌱 load gardens");
  }, [plantId]);

  const onAdd = async (evt) => {
    evt.preventDefault();
    // Barbara: POST /api/gardens/:gardenId/plantings
    console.log("🌿 add planting to garden", { plantId, ...form });
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
          {/* Barbara - render when-to-plant windows */}
          </>
        )}
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
