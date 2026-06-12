import "./RegionInfoPanel.css";

function RegionInfoPanel({ stateName, data }) {
  if (!data) {
    return (
      <div className="region-panel">
        <h2>Select State</h2>
        <p>Click on a state to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="region-panel">
      <h2>{stateName}</h2>

      <div className="metric">
        <span>Revenue</span>
        <strong>{data.revenue}</strong>
      </div>

      <div className="metric">
        <span>Growth</span>
        <strong>{data.growth}%</strong>
      </div>

      <div className="metric">
        <span>Orders</span>
        <strong>{data.orders}</strong>
      </div>

      <div className="metric">
        <span>Customers</span>
        <strong>{data.customers}</strong>
      </div>

      <div className="metric">
        <span>Top Product</span>
        <strong>{data.topProduct}</strong>
      </div>

      <div className="section">
        <h4>Insight</h4>
        <p>{data.insight}</p>
      </div>

      <div className="section">
        <h4>Recommendation</h4>
        <p>{data.recommendation}</p>
      </div>
    </div>
  );
}

export default RegionInfoPanel;