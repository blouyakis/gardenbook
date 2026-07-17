import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const GARDEN_TYPES = ["vegetable", "herb", "fruit", "flower"];

export default function GardenFormModal({ show, garden, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("vegetable");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(garden?.name ?? "");
    setType(garden?.type ?? "vegetable");
    setError(null);
  }, [garden, show]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name, type });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{garden ? "Edit garden" : "New garden"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Backyard beds"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              {GARDEN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button className="btn-gb-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

GardenFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  garden: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

GardenFormModal.defaultProps = {
  garden: null,
};
