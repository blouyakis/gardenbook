import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function CalendarGrid({ days = [] }) {

  const today = new Date().toLocaleDateString("en-CA"); 
  const placeholderDays =
    days.length === 7
      ? days
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
          date: label,
          label,
          plantings: [],
        }));

  return (
    <Row className="g-1">
      {placeholderDays.map((day) => {
        const isToday = day.date === today;
        return (
          <Col key={day.date} xs={12} md style={{ minHeight: "8rem" }}>
            <Card 
              body 
              className="h-100"
              style={isToday ? { borderColor: "var(--gb-crimson-bright)", borderWidth: "2px" } : undefined}>
              <div className="text-center small" style={isToday ? { color: "var(--gb-crimson-bright)", fontWeight: 600 } : undefined}>
                {day.label}
              </div>
              {day.plantings?.map((p) => (
                <div key={p._id} className="small rounded px-1 my-1"
                  style={{ backgroundColor: `var(--gb-${p.type}, var(--gb-surface))` }}>
                  {p.name}
                </div>
              ))}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
