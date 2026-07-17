import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const GARDEN_LINKS = [
  { label: "MyGardens", to: "/mygarden" },
  { label: "MyVegetables", to: "/mygarden?type=vegetable" },
  { label: "MyHerbs", to: "/mygarden?type=herb" },
  { label: "MyFruits", to: "/mygarden?type=fruit" },
  { label: "MyFlowers", to: "/mygarden?type=flower" },
];

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Logged-out: the About view.
  if (!user) {
    return (
      <div className="text-center" style={{ paddingBottom: "10vh" }}>
        <p className="mx-auto" style={{ maxWidth: "36rem", marginTop: "140px" }}>
          GardenBook tells you what to plant and when to plant it. Enter
          your ZIP code and we detect your USDA hardiness zone and frost
          dates automatically — then every recommendation is matched to
          your region and your calendar.
          <hr></hr>
          Browse a photo catalog of plants you can put in the ground this
          week — or any week, past or future — and add them to gardens you
          organize by type: vegetables, herbs, fruits, and flowers. Your
          weekly calendar shows every planting on its intended date, color
          coded by garden, with spring and fall windows tracked separately
          for crops that get planted twice.
          <hr></hr>
          When it's time to work, export any week — the whole garden
          or a single type — as a printable PDF for the potting bench, the
          barn door, or whoever&apos;s helping you plant.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button as={Link} to="/register" variant="gb-primary">
            Create an account
          </Button>
          <Button as={Link} to="/login" variant="outline-secondary">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Logged-in: the garden view
  return (
    <div>
      <div className="text-center">
        <h3 className="gb-wordmark my-4">Gardening, simplified.</h3>
      </div>
      <Row className="g-3">
        {GARDEN_LINKS.map((g) => (
          <Col md={4} xs={6} key={g.to}>
            <Card body className="text-center">
              <Button
                as={Link}
                to={g.to}
                variant="gb-primary"
                className="w-100"
              >
                {g.label}
              </Button>
            </Card>
          </Col>
        ))}
        <Col md={4} xs={6}>
          <Card body className="text-center">
            <Button
              as={Link}
              to="/explore"
              variant="gb-explore"
              className="w-100"
            >
              Explore Gardens
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}