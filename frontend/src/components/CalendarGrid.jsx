import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

// Barbara — 7-column week grid.
// `days` shape suggestion: [{ date, label, plantings: [{ _id, name, type }] }]
// Chip colors by type via the --gb-* CSS variables.
export default function CalendarGrid({ days = [] }) {
  const placeholderDays =
    days.length === 7
      ? days
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
          label,
          plantings: [],
        }));

  return (
    <Row className="g-1">
      {placeholderDays.map((day) => (
        <Col key={day.label} style={{ minHeight: "8rem" }}>
          <Card body className="h-100">
            <div className="text-center small">{day.label}</div>
            {day.plantings?.map((p) => (
              <div key={p._id} className="small rounded px-1 my-1"
                style={{ backgroundColor: `var(--gb-${p.type}, var(--gb-surface))` }}>
                {p.name}
              </div>
            ))}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
