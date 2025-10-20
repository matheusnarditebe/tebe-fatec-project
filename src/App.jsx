import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Widget from "./components/Widget";

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

  const lastSpotData = spotData ? spotData[0] : null;

  const spotInfo = spots
    ? spots.find((spot) => spot.spot_id === selectedSpotId)
    : null;

  return (
    <div className="mainContainer">
      <h1>Ar condicionado inteligente</h1>

      <div>
        <h2>Ponto de coleta</h2>
        {loadingSpots && <p className="loadingText">Carregando pontos...</p>}
        {spots && (
          <div className="spotsContainer">
            {spots.map((spot) => (
              <div
                key={spot.spot_id}
                className={`spotItem ${
                  spot.spot_id === selectedSpotId ? "selectedSpot" : ""
                }`}
                onClick={() => setSelectedSpotId(spot.spot_id)}
              >
                <p>{spot.spot_name}</p>
              </div>
            ))}
          </div>
        )}

        {spotInfo && (
          <div>
            <p className="infoLabel">
              ID do sensor: <span>{spotInfo.sensor_id}</span>
            </p>
            <p className="infoLabel">
              Status de conexão:{" "}
              {spotInfo.connection_status === "connected" ? (
                <span className="connectedLabel">Conectado</span>
              ) : (
                <span className="disconnectedLabel">Desconectado</span>
              )}
            </p>
            <p className="infoLabel">
              Nível da bateria: <span>{spotInfo.battery_level}%</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <h2>Última coleta</h2>
        {loadingSpotData && <p className="loadingText">Carregando dados...</p>}
        {lastSpotData && (
          <>
            <p className="infoLabel">
              Data:{" "}
              <span>
                {new Date(lastSpotData.timestamp * 1000).toLocaleString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </p>
            <div className="dashboard">
              <Widget title="Temperatura">
                <p>{lastSpotData.temperature} °C</p>
              </Widget>

              <Widget title="Velocidade">
                <div>
                  <p className="infoLabel">
                    Axial: <span>{lastSpotData.velocity_axial} mm/s</span>
                  </p>
                  <p className="infoLabel">
                    Horizontal:{" "}
                    <span>{lastSpotData.velocity_horizontal} mm/s</span>
                  </p>
                  <p className="infoLabel">
                    Vertical: <span>{lastSpotData.velocity_vertical} mm/s</span>
                  </p>
                </div>
              </Widget>

              <Widget title="Aceleração">
                <div>
                  <p className="infoLabel">
                    Axial: <span>{lastSpotData.acceleration_axial} g</span>
                  </p>
                  <p className="infoLabel">
                    Horizontal:{" "}
                    <span>{lastSpotData.acceleration_horizontal} g</span>
                  </p>
                  <p className="infoLabel">
                    Vertical:{" "}
                    <span>{lastSpotData.acceleration_vertical} g</span>
                  </p>
                </div>
              </Widget>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
