import "./styles/index.css";

const SpotItem = ({ spotId, spotName, selectedSpotId, onClick }) => {
  return (
    <div
      className={`spotItem ${spotId === selectedSpotId ? "selectedSpot" : ""}`}
      onClick={onClick}
    >
      <p>{spotName}</p>
    </div>
  );
};

export default SpotItem;
