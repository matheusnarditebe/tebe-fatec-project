import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Spot from "./components/Spot";
import Dashboard from "./components/Dashboard";
import { API_KEY } from "./constants";

function App() {
  const [spots, setSpots] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  const [loadingSpots, setLoadingSpots] = useState(true);

  useEffect(() => {
    const getSpots = async () => {
      try {
        setLoadingSpots(true);
        setSpots(null);
        const response = await axios.get("https://api.iotebe.com/v2/spot", {
          headers: {
            "x-api-key": API_KEY,
          },
        });
        setSpots(response.data);
        setSelectedSpotId(response.data[0].spot_id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSpots(false);
      }
    };

    getSpots();
  }, []);

  return (
    <div className="mainContainer">
      <h1>Ar condicionado inteligente</h1>

      <Spot
        loadingSpots={loadingSpots}
        spots={spots}
        selectedSpotId={selectedSpotId}
        setSelectedSpotId={setSelectedSpotId}
      />

      <Dashboard selectedSpotId={selectedSpotId} />
    </div>
  );
}

export default App;
