import Button from "react-bootstrap/Button";

export function currentMonday() {
  const now = new Date();
  const shift = (now.getDay() + 6) % 7; 
  now.setDate(now.getDate() - shift);
  return now.toLocaleDateString("en-CA");
}

function parseLocal(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d); 
}

function toYMD(date) {
  return date.toLocaleDateString("en-CA");
}

export default function WeekNav({ week, setWeek }) {
  const shiftWeek = (deltaDays) => {
    const d = parseLocal(week);
    d.setDate(d.getDate() + deltaDays); 
    setWeek(toYMD(d));
  };

  const monday = parseLocal(week);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const label = `Week of ${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`;

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 my-3">
      <Button variant="outline-secondary" size="sm" onClick={() => shiftWeek(-7)} aria-label="Previous week">
        &lt;
      </Button>
      <strong>{week ? label : "Week of ..."}</strong>
      <Button variant="outline-secondary" size="sm" onClick={() => shiftWeek(7)} aria-label="Next week">
        &gt;
      </Button>
    </div>
  );
}