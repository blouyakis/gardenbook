import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router";

import GardenTypeToggle from "../components/GardenTypeToggle.jsx";
import WeekNav, { currentMonday } from "../components/WeekNav.jsx";
import CalendarGrid from "../components/CalendarGrid.jsx";
import Button from "react-bootstrap/Button";

// Barbara — MyGarden weekly calendar (all gardens + per-garden).
export default function MyGardenPage() {
  const { gardenId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") 
  const [week, setWeek] = useState(currentMonday()); 
  const [days, setDays] = useState([]);

  const reloadCalendar = useCallback(async () => {
    const params = new URLSearchParams({ week });
    if (type) params.set("type", type);
    const url = gardenId
      ? `/api/calendar/${gardenId}?${params}`
      : `/api/calendar?${params}`;
    const res = await fetch(url);
    if (!res.ok) {
      setDays([]);
      return;
    }
    setDays(await res.json());
    }, [gardenId, type, week]);

  useEffect(() => {
    reloadCalendar();
  }, [reloadCalendar]);

  const onExport = () => {
    const params = new URLSearchParams({ week });
    if (gardenId) params.set("gardenId", gardenId);
    if (type) params.set("type", type);
    window.location = `/api/calendar/export?${params.toString()}`;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-3">
        <GardenTypeToggle activeType={type} />
        <Button variant="gb-outline" size="sm" onClick={onExport}>
          Export PDF
        </Button>
      </div>
      <WeekNav week={week} setWeek={setWeek} />
      <CalendarGrid days={days} />
    </>
  );
}
