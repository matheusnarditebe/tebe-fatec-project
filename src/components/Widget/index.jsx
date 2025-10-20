import "./styles/index.css";

const Widget = ({ title, children }) => {
  return (
    <div className="widget">
      <h3 className="widgetTitle">{title}</h3>
      {children}
    </div>
  );
};

export default Widget;
