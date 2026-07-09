import Button from "react-bootstrap/Button";

// Barbara — shared by MyGarden and Explore (same layout on purpose).
// Compute prev/next week from `week` (a YYYY-MM-DD Monday) and
// format the "Week of ..." label.
export default function WeekNav({ week, setWeek }) {
  const onPrev = () => console.log("⬅️ prev week (not implemented)");
  const onNext = () => console.log("➡️ next week (not implemented)");

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 my-3">
      <Button variant="outline-secondary" size="sm" onClick={onPrev}>
        &lt;
      </Button>
      <strong>{week || "Week of ..."}</strong>
      <Button variant="outline-secondary" size="sm" onClick={onNext}>
        &gt;
      </Button>
    </div>
  );
}
