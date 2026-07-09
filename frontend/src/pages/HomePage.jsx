import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

// Shared — landing page with buttons into each garden view.
// Replace the static cards with the user's real gardens
// (GET /api/gardens) once Aleena's gardens CRUD is live.
const GARDEN_LINKS = [
  { label: "MyGardens", to: "/mygarden" },
  { label: "MyVegetables", to: "/mygarden?type=vegetable" },
  { label: "MyHerbs", to: "/mygarden?type=herb" },
  { label: "MyFruits", to: "/mygarden?type=fruit" },
  { label: "MyFlowers", to: "/mygarden?type=flower" },
];

export default function HomePage() {
  return (
    <>
    <div className="text-center" style={{ marginTop: "26vh" }}>
      <h3 className="gb-wordmark my-4">Gardening, simplified.</h3>
    </div>
      <Row className="g-3">
        {GARDEN_LINKS.map((g) => (
          <Col md={4} xs={6} key={g.to}>
            <Card body className="text-center">
              <Button as={Link} to={g.to} className="btn-gb-primary w-100">
                {g.label}
              </Button>
            </Card>
          </Col>
        ))}
        <Col md={4} xs={6}>
          <Card body className="text-center">
            <Button as={Link} to="/explore" variant="gb-explore" className="w-100">
              Explore Gardens
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
}
