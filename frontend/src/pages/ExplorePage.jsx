import { useState, useEffect, useCallback } from "react";

import WeekNav from "../components/WeekNav.jsx";
import PlantCard from "../components/PlantCard.jsx";
import PlantDetailModal from "../components/PlantDetailModal.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Barbara — Explore: search + week nav + plantable-this-week grid.
export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState(""); // Make this default to current week
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const reloadPlants = useCallback(async () => {
    // Barbara: GET /api/plants?search=&week=&type=
    console.log("🔎 reloadPlants", { query, week });
  }, [query, week]);

  useEffect(() => {
    const timeout = setTimeout(reloadPlants, 300); 
    return () => clearTimeout(timeout);
  }, [reloadPlants]);

  return (
    <>
      <Form.Control
        className="my-3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plants"
      />
      <WeekNav week={week} setWeek={setWeek} />

      <Row className="g-3">
        {!plants?.length ? (
          <p className="text-center">No plants yet — implement GET /api/plants 🌱</p>
        ) : (
          plants.map((plant) => (
            <Col md={3} xs={6} key={plant._id}>
              <PlantCard plant={plant} onClick={() => setSelectedPlantId(plant._id)} />
            </Col>
          ))
        )}
      </Row>

      <PlantDetailModal
        plantId={selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
      />
    </>
  );
}
