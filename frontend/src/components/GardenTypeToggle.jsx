import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";
import PropTypes from "prop-types";

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
        const isActive = (activeType ?? undefined) === t.to.split("=")[1];
        return (
          <Button
            key={t.label}
            as={Link}
            to={t.to}
            size="sm"
            variant={isActive ? "gb-primary" : "gb-outline"}
          >
            {t.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

GardenTypeToggle.propTypes = {
  activeType: PropTypes.string,
};
