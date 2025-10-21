import { useEffect, useState } from "react";
import PeriodItem from "../PeriodItem";
import Widget from "../Widget";
import axios from "axios";
import { API_KEY } from "../../constants";

const now = (new Date().getTime() / 1000).toFixed(0); // data e hora em timestamp

const periods = [
  {
    label: "Últimas 24 horas",
    id: "last24Hours",
    startTime: now - 24 * 60 * 60, // timestamp de 24h atrás
    endTime: now, // agora
  },
  {
    label: "Últimos 7 dias",
    id: "last7Days",
    startTime: now - 7 * 24 * 60 * 60, // timestamp de 7 dias atrás
    endTime: now, // agora
  },
  {
    label: "Últimos 30 dias",
    id: "last30Days",
    startTime: now - 30 * 24 * 60 * 60, // timestamp de 30 dias atrás
    endTime: now, // agora
  },
];

const findPeriodInfo = (periodId) => {
  return periods.find((period) => period.id === periodId);
};

const Dashboard = ({ selectedSpotId }) => {
  const [spotData, setSpotData] = useState(null);
  const [loadingSpotData, setLoadingSpotData] = useState(true);

  const [selectedPeriodId, setSelectedPeriodId] = useState("last24Hours");
  const [periodInfo, setPeriodInfo] = useState(findPeriodInfo("last24Hours"));

  const [avgSpotData, setAvgSpotData] = useState(null);

  useEffect(() => {
    const getSpotData = async () => {
      try {
        setLoadingSpotData(true);
        setSpotData(null);
        const response = await axios.get(
          `https://api.iotebe.com/v2/spot/${selectedSpotId}/ng1vt/global_data/data?start_date=${periodInfo.startTime}&end_date=${periodInfo.endTime}`,
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
  }, [periodInfo.endTime, periodInfo.startTime, selectedSpotId]);

  useEffect(() => {
    setPeriodInfo(findPeriodInfo(selectedPeriodId));
  }, [selectedPeriodId]);

  useEffect(() => {
    // Se não houver dados do spot, não continuar e definir avgSpotData como null
    if (!spotData || spotData.length === 0) {
      setAvgSpotData(null);
      return;
    }

    // Calcular a média dos dados filtrados
    // Esse código é um acumulador que soma os valores de cada campo
    const avgData = spotData.reduce(
      (acc, dataPoint) => {
        acc.temperature += dataPoint.temperature;
        acc.velocity_axial += dataPoint.velocity_axial;
        acc.velocity_horizontal += dataPoint.velocity_horizontal;
        acc.velocity_vertical += dataPoint.velocity_vertical;
        acc.acceleration_axial += dataPoint.acceleration_axial;
        acc.acceleration_horizontal += dataPoint.acceleration_horizontal;
        acc.acceleration_vertical += dataPoint.acceleration_vertical;
        return acc;
      },
      // Valor inicial do acumulador
      // Todas as métricas começam em 0
      {
        temperature: 0,
        velocity_axial: 0,
        velocity_horizontal: 0,
        velocity_vertical: 0,
        acceleration_axial: 0,
        acceleration_horizontal: 0,
        acceleration_vertical: 0,
      }
    );

    // Conta quantos pontos de dados existem no período para calcular a média
    const count = spotData.length;

    for (let key in avgData) {
      // Divide a soma pelo número de pontos para obter a média
      avgData[key] /= count;
      // Reduz para duas casas decimais
      avgData[key] = parseFloat(avgData[key].toFixed(2));
    }

    // Define os dados médios no estado
    setAvgSpotData(avgData);
  }, [spotData]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="periodsContainer">
        {periods.map((period) => (
          <PeriodItem
            key={period.id}
            label={period.label}
            id={period.id}
            onClick={() => setSelectedPeriodId(period.id)}
            selectedPeriodId={selectedPeriodId}
          />
        ))}
      </div>
      {loadingSpotData && <p className="loadingText">Carregando dados...</p>}
      {avgSpotData && (
        <>
          <div className="dashboard">
            <Widget title="Temperatura média">
              <p>{avgSpotData.temperature} °C</p>
            </Widget>

            <Widget title="Velocidade média">
              <div>
                <p className="infoLabel">
                  Axial: <span>{avgSpotData.velocity_axial} mm/s</span>
                </p>
                <p className="infoLabel">
                  Horizontal:{" "}
                  <span>{avgSpotData.velocity_horizontal} mm/s</span>
                </p>
                <p className="infoLabel">
                  Vertical: <span>{avgSpotData.velocity_vertical} mm/s</span>
                </p>
              </div>
            </Widget>

            <Widget title="Aceleração média">
              <div>
                <p className="infoLabel">
                  Axial: <span>{avgSpotData.acceleration_axial} g</span>
                </p>
                <p className="infoLabel">
                  Horizontal:{" "}
                  <span>{avgSpotData.acceleration_horizontal} g</span>
                </p>
                <p className="infoLabel">
                  Vertical: <span>{avgSpotData.acceleration_vertical} g</span>
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
