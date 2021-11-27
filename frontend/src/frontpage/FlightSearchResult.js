import { ReactComponent as AirplaneSvg } from "../icons/airplane.svg";
import "./flightsearchresult.scss";

const FlightSearchRow = () => {
  return (
    <div className="d-flex mb-3">
      { /* card starts here */ }
      <div className="card flight-info-card col-md-6">
        <div className="card-body">
          <div className="d-flex justify-content-between card-search-info">
            <span>DL384, DL796, DL1220</span>
            <span>17h15m</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-light">4:45pm</h2>
            <i className="card-icon">
              <AirplaneSvg />
            </i>
            <h2 className="fw-light">12:45am</h2>
          </div>
          <svg height="30" width="100%">
            <rect x="10px" y="4" width="calc(95% - 10px)" height="0.7" />
            <svg x="5px">
              <rect width="8" height="8" transform="translate(5)"/>
              <text y="20" style={{ fontSize: '0.8rem' }}>JFK</text>
            </svg>
            <svg x="47%">
              <rect width="8" height="8" transform="translate(5)"/>
              <text y="20" style={{ fontSize: '0.8rem' }}>SEA</text>
            </svg>
            <svg x="94%">
              <rect width="8" height="8" transform="translate(5)"/>
              <text y="20" style={{ fontSize: '0.8rem' }}>FAI</text>
            </svg>
          </svg>
        </div>
        <div className="card-footer btn btn-link text-decoration-none text-start py-1 px-2 fs-6 fw-light">
          Details
        </div>
      </div>
      { /* card ends here */ }
      <div className="card card-price price-eco col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center">
        $1,781
      </div>
      <div className="card card-price price-biz col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center">
        $2,077
      </div>
      <div className="card card-price price-first col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center">
        $3,365
      </div>
    </div>
  );
}
const FlightSearchResult = () => {
  return (
    <div className="p-3">
      <div className="d-flex">
        <div className="col-md-6">
          <h4>Mon, Dec 20, 2021</h4>
          <small className="card-hint">
            Price includes taxes and fees. 
            <span className="text-blue fw-bold"> Baggage fee </span> 
            may apply. Services and amenities may
            <span className="text-blue fw-bold"> vary or change.</span>
          </small>
        </div>
        <div className="col-md-2 d-none d-sm-none d-md-flex align-items-center justify-content-center text-center">
          Economy
        </div>
        <div className="col-md-2 d-none d-sm-none d-md-flex align-items-center justify-content-center text-center">
          Business
        </div>
        <div className="col-md-2 d-none d-sm-none d-md-flex align-items-center justify-content-center text-center">
          First
        </div>
      </div>
      <FlightSearchRow />
      <FlightSearchRow />
      <FlightSearchRow />
      <FlightSearchRow />
      <FlightSearchRow />
    </div>
  );
};

export default FlightSearchResult;