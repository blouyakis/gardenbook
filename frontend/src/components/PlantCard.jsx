import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";

// Silenced the emoji's from screen readers via <div aria-hidden="true">
// Used <alt=""> to silence repetitive plant names from screen readers

export default function PlantCard({ plant, onClick }) {
  const hasWindow = Array.isArray(plant.windows);
  const flex = plant.flexOnly === true;
  return (
    <Card
      className={
        hasWindow
          ? flex
            ? "border-warning border-2"
            : "border-success border-2"
          : ""
      }
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      {plant.imageUrl ? (
        <Card.Img
          variant="top"
          src={plant.imageUrl}
          alt=""
          style={{ height: "8rem", objectFit: "cover" }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          aria-hidden="true"
          style={{
            height: "8rem",
            backgroundColor: `var(--gb-${plant.type}-tint, var(--gb-surface))`,
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
        {flex && (
          <Card.Text className="small text-warning-emphasis mb-0">
            <span aria-hidden="true">⚡</span> Edge of planting window
          </Card.Text>
        )}
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
    flexOnly: PropTypes.bool,
    windows: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
