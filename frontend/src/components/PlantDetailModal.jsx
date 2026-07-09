import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Barbara — click-through from Explore.
// Shows summary + when-to-plant windows, then the add-to-garden flow:
// garden <select> (GET /api/gardens) + date + Add
// (POST /api/gardens/:gardenId/plantings).
export default function PlantDetailModal({ plantId, onClose }) {
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    if (!plantId) return;
    // Barbara: GET /api/plants/:id -> setPlant
    console.log("🌼 load plant detail", plantId);
  }, [plantId]);

  return (
    <Modal show={!!plantId} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{plant?.commonName || "Plant Detail"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Barbara: summary, when-to-plant timeline, care icons */}
        <p className="text-body-secondary">
          Implement GET /api/plants/:id and render the planting windows here.
        </p>
      </Modal.Body>
      <Modal.Footer>
        {/* Barbara: garden select + date input + Add button */}
        <Button className="btn-gb-primary" disabled>
          Add to garden
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
