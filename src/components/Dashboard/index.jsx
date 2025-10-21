import { useEffect, useState } from "react";
import Widget from "../Widget";
import axios from "axios";
import { API_KEY } from "../../constants";

const now = (new Date().getTime() / 1000).toFixed(0); // data e hora em timestamp

const Dashboard = ({ selectedSpotId }) => {
  const [spotData, setSpotData] = useState(null);
  const [loadingSpotData, setLoadingSpotData] = useState(true);

  const [avgSpotData, setAvgSpotData] = useState(null);

  useEffect(() => {
    const startTime = now - 24 * 60 * 60;
    const endTime = now;
    const getSpotData = async () => {
      try {
        setLoadingSpotData(true);
        setSpotData(null);
        const response = await axios.get(
          `https://api.iotebe.com/v2/spot/${selectedSpotId}/ng1vt/global_data/data?start_date=${startTime}&end_date=${endTime}`,
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
        return acc;
      },
      // Valor inicial do acumulador
      // Todas as métricas começam em 0
      {
        temperature: 0,
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
      <p className="infoLabel">
        Período: <span>Últimas 24 horas</span>
      </p>
      {loadingSpotData && <p className="loadingText">Carregando dados...</p>}
      {avgSpotData && (
        <>
          <div className="dashboard">
            <Widget title="Temperatura média">
              <p>{avgSpotData.temperature} °C</p>
            </Widget>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
