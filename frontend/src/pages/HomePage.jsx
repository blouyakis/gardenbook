import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import "./HomePage.css";

// Removed <hr> from inside <p> and separated paragraphs for better readability
// Made the main heading an h1 for better accessibility, kept size with fs-3 in className

const GARDEN_LINKS = [
  {
    label: "My Gardens",
    to: "/mygarden",
    type: "gardens",
    img: "/tiles/gardens.png",
  },
  {
    label: "My Vegetables",
    to: "/mygarden?type=vegetable",
    type: "vegetable",
    img: "/tiles/vegetables.png",
  },
  {
    label: "My Herbs",
    to: "/mygarden?type=herb",
    type: "herb",
    img: "/tiles/herbs.png",
  },
  {
    label: "My Fruits",
    to: "/mygarden?type=fruit",
    type: "fruit",
    img: "/tiles/fruits.png",
  },
  {
    label: "My Flowers",
    to: "/mygarden?type=flower",
    type: "flower",
    img: "/tiles/flowers.png",
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Logged-out: the About view.
  if (!user) {
    return (
      <div className="text-center" style={{ paddingBottom: "10vh" }}>
        <div style={{ marginTop: "60px" }}>
          <h1 className="gb-wordmark fs-1">GardenBook</h1>
        </div>
        <p className="mx-auto" style={{ maxWidth: "36rem", marginTop: "75px" }}>
          GardenBook tells you what to plant and when to plant it. Enter your
          ZIP code and we detect your USDA hardiness zone and frost dates
          automatically — then every recommendation is matched to your region
          and your calendar.
        </p>
        <p className="mx-auto" style={{ maxWidth: "36rem" }}>
          Browse a photo catalog of plants you can put in the ground this week —
          or any week, past or future — and add them to gardens you organize by
          type: vegetables, herbs, fruits, and flowers. Your weekly calendar
          shows every planting on its intended date, color coded by garden, with
          spring and fall windows tracked separately for crops that get planted
          twice.
        </p>
        <p className="mx-auto" style={{ maxWidth: "36rem" }}>
          When it's time to work, export any week — the whole garden or a single
          type — as a printable PDF for the potting bench, the barn door, or
          whoever&apos;s helping you plant.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button as={Link} to="/register" variant="gb-primary">
            Create an account
          </Button>
          <Button as={Link} to="/login" variant="gb-primary">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Logged-in: the garden view
  return (
    <div>
      <div className="text-center gb-page-heading">
        <h1 className="gb-wordmark fs-3">Gardening, simplified.</h1>
        <p className="text-body-secondary">
          Welcome back, {user.displayName}. Where would you like to start?
        </p>
      </div>
      <Row className="g-3 justify-content-center">
        {GARDEN_LINKS.map((g) => (
          <Col lg={4} md={4} sm={6} xs={6} key={g.to}>
            <Link
              to={g.to}
              className="gb-home-tile"
              style={{
                "--tile-accent": `var(--gb-${g.type}, var(--gb-crimson))`,
              }}
            >
              <img className="gb-home-tile-img" src={g.img} alt="" />
              <span className="gb-home-tile-label">{g.label}</span>
            </Link>
          </Col>
        ))}
        <Col lg={4} md={4} sm={6} xs={6}>
          <Link
            to="/explore"
            className="gb-home-tile gb-home-tile-explore"
            style={{ "--tile-accent": "var(--gb-explore)" }}
          >
            <img className="gb-home-tile-img" src="/tiles/explore.png" alt="" />
            <span className="gb-home-tile-label">Explore Plants</span>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
