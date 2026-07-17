import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router";
import WeekNav, { currentMonday } from "../components/WeekNav.jsx";
import PlantCard from "../components/PlantCard.jsx";
import PlantDetailModal from "../components/PlantDetailModal.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default function ExplorePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState(currentMonday());
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const reloadPlants = useCallback(async () => {
    const params = new URLSearchParams({ week });
    if (query) params.set("search", query);
    const res = await fetch(`/api/plants?${params}`);
    if (!res.ok) {
      setPlants([]);
      return;
    }
    setPlants(await res.json());
  }, [query, week]);

  useEffect(() => {
    const timeout = setTimeout(reloadPlants, 300);
    return () => clearTimeout(timeout);
  }, [reloadPlants]);

  return (
    <div style={{ paddingTop: "22vh" }}>
      <Form.Control
        className="my-3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plants"
      />
      {user ? (
        <WeekNav week={week} setWeek={setWeek} />
      ) : (
        <p className="text-center fs-5 my-3">
          Browse the plant catalog here or <Link to="/login">Log in</Link> to see
          plantings this week in your region.
        </p>
      )}

      <Row className="g-3">
        {!plants?.length ? (
          <p className="text-center">🌱 No plants yet 🌱</p>
        ) : (
          plants.map((plant) => (
            <Col md={3} xs={6} key={plant._id}>
              <PlantCard
                plant={plant}
                onClick={() => setSelectedPlantId(plant._id)}
              />
            </Col>
          ))
        )}
      </Row>

      <PlantDetailModal
        plantId={selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
      />
    </div>
  );
}
