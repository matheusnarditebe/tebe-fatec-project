import SpotItem from "../SpotItem";

const Spot = ({ loadingSpots, spots, selectedSpotId, setSelectedSpotId }) => {
  const spotInfo = spots
    ? spots.find((spot) => spot.spot_id === selectedSpotId)
    : null;

  return (
    <div>
      <h2>Ponto de coleta</h2>
      {loadingSpots && <p className="loadingText">Carregando pontos...</p>}
      {spots && (
        <div className="spotsContainer">
          {spots.map((spot) => (
            <SpotItem
              key={spot.spot_id}
              spotId={spot.spot_id}
              spotName={spot.spot_name}
              selectedSpotId={selectedSpotId}
              onClick={() => setSelectedSpotId(spot.spot_id)}
            />
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
  );
};

export default Spot;
