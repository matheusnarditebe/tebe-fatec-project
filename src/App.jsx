import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Spot from "./components/Spot";
import Dashboard from "./components/Dashboard";

function App() {
  const API_KEY = "8mX7gZlFBm0bJ7jjhjg8atBpr5eGql72xYvIMpT4";

  const [spots, setSpots] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [spotData, setSpotData] = useState(null);

  const [loadingSpots, setLoadingSpots] = useState(true);
  const [loadingSpotData, setLoadingSpotData] = useState(true);

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

  useEffect(() => {
    const getSpotData = async () => {
      try {
        setLoadingSpotData(true);
        setSpotData(null);
        const response = await axios.get(
          `https://api.iotebe.com/v2/spot/${selectedSpotId}/ng1vt/global_data/data`,
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );
        setSpotData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSpotData(false);
      }
    };

    if (selectedSpotId) {
      getSpotData();
    }
  }, [selectedSpotId]);

  return (
    <div className="mainContainer">
      <h1>Ar condicionado inteligente</h1>

      <Spot
        loadingSpots={loadingSpots}
        spots={spots}
        selectedSpotId={selectedSpotId}
        setSelectedSpotId={setSelectedSpotId}
      />

      <Dashboard loadingSpotData={loadingSpotData} spotData={spotData} />
    </div>
  );
}

export default App;
