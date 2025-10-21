import "./styles/index.css";

const PeriodItem = ({ label, id, selectedPeriodId, onClick }) => {
  return (
    <div
      className={`periodItem ${
        id === selectedPeriodId ? "selectedPeriod" : ""
      }`}
      onClick={onClick}
    >
      <p>{label}</p>
    </div>
  );
};

export default PeriodItem;
