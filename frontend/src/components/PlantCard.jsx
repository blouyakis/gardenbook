import Card from "react-bootstrap/Card";

export default function PlantCard({ plant, onClick }) {
  return (
    <Card 
    onClick={onClick} 
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }} 
    role="button"
    tabIndex={0}
    style={{ cursor: "pointer" }}>
      {plant.imageUrl ? (
        <Card.Img
          variant="top"
          src={plant.imageUrl}
          alt={plant.commonName}
          style={{ height: "8rem", objectFit: "cover" }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            height: "8rem",
            backgroundColor: "var(--gb-${plant.type}, var(--gb-surface))",
            opacity: 0.35,
          }}
        >
          🌱🌸🌿
        </div>
      )}
      <Card.Body className="py-2">
        <Card.Title className="fs-6 mb-0 text-truncate">
          {plant.commonName}
        </Card.Title>
        <Card.Text className="small text-body-secondary">
          {plant.type} {plant.method ? `· ${plant.method}` : ""}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

PlantCard.propTypes = {
  plant: PropTypes.shape({
    commonName: PropTypes.string.isRequired,
    type: PropTypes.string,
    method: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
