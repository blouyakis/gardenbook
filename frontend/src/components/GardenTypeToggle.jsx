import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

// Barbara — toggle pills above the calendar.
// Active pill = solid crimson (btn-gb-primary); inactive = quiet outline.
const TYPES = [
  { label: "All", to: "/mygarden" },
  { label: "Vegetables", to: "/mygarden?type=vegetable" },
  { label: "Herbs", to: "/mygarden?type=herb" },
  { label: "Fruits", to: "/mygarden?type=fruit" },
  { label: "Flowers", to: "/mygarden?type=flower" },
];

export default function GardenTypeToggle({ activeType }) {
  return (
    <ButtonGroup>
      {TYPES.map((t) => {
        // activeType is null when no ?type= param is set (the All view), but
        // "/mygarden".split("=")[1] is undefined — normalize null -> undefined
        // so the All pill can match and highlight.
        const isActive = (activeType ?? undefined) === t.to.split("=")[1];
        return (
          <Button
            key={t.label}
            as={Link}
            to={t.to}
            size="sm"
            variant={isActive ? undefined : "outline-secondary"}
            className={isActive ? "btn-gb-primary" : ""}
          >
            {t.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}