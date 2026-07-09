import Card from "react-bootstrap/Card";

// Barbara — Explore grid card: photo, name below it (per proposal).
export default function PlantCard({ plant, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: "pointer" }}>
      <Card.Img
        variant="top"
        src={plant.imageUrl}
        alt={plant.commonName}
        style={{ height: "8rem", objectFit: "cover" }}
      />
      <Card.Body className="py-2">
        <Card.Title className="fs-6 mb-0">{plant.commonName}</Card.Title>
        <Card.Text className="small text-body-secondary">
          {plant.type} {plant.method ? `· ${plant.method}` : ""}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
