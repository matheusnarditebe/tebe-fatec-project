import Widget from "../Widget";

const Dashboard = ({ loadingSpotData, spotData }) => {
  const lastSpotData = spotData ? spotData[0] : null;
  return (
    <div>
      <h2>Última coleta</h2>
      {loadingSpotData && <p className="loadingText">Carregando dados...</p>}
      {lastSpotData && (
        <>
          <p className="infoLabel">
            Data:{" "}
            <span>
              {new Date(lastSpotData.timestamp * 1000).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
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
                  Vertical: <span>{lastSpotData.acceleration_vertical} g</span>
                </p>
              </div>
            </Widget>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
