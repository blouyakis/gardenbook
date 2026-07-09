import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router";

import GardenTypeToggle from "../components/GardenTypeToggle.jsx";
import WeekNav from "../components/WeekNav.jsx";
import CalendarGrid from "../components/CalendarGrid.jsx";
import Button from "react-bootstrap/Button";

// Barbara — MyGarden weekly calendar (all gardens + per-garden).
export default function MyGardenPage() {
  const { gardenId } = useParams();
  const [searchParams] = useSearchParams();
  const [week, setWeek] = useState(""); // Make default to current week (YYYY-MM-DD of Monday)
  const [days, setDays] = useState([]);

  const reloadCalendar = useCallback(async () => {
    // Barbara: GET /api/calendar?week= or /api/calendar/:gardenId?week=
    // setDays(await res.json())
    console.log("🌱 reloadCalendar", { gardenId, week });
  }, [gardenId, week]);

  useEffect(() => {
    reloadCalendar();
  }, [reloadCalendar]);

  const onExport = () => {
    // Aleena — PDF export. A plain navigation triggers the download:
    // window.location = `/api/calendar/export?week=${week}&gardenId=${gardenId ?? ""}`
    console.log("🖨️ export PDF (not implemented)");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-3">
        <GardenTypeToggle activeType={searchParams.get("type")} />
        <Button variant="outline-secondary" size="sm" onClick={onExport}>
          Export PDF
        </Button>
      </div>
      <WeekNav week={week} setWeek={setWeek} />
      <CalendarGrid days={days} />
    </>
  );
}
