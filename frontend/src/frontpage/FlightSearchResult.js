import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReactComponent as AirplaneSvg } from "../icons/airplane.svg";
import "./flightsearchresult.scss";

const FlightDetails = ({ flight }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = moment(searchParams.get('date'), 'YYYY-MM-DD');
  return (
    <>
      {
        flight.map((f, idx) => {
          const from = moment(f.departureTime, "HH:mm");
          const to = moment(f.arrivalTime, "HH:mm");
          let diff;
          if (to.isAfter(from)) {
            diff = to.subtract(from.hours(), 'hours').subtract(from.minutes(), 'minutes');
          } else {
            const d = moment("00:00", "HH:mm").subtract(from.hours(), 'hours').subtract(from.minutes(), 'minutes');
            diff = to.add(d.hours(), 'hours').add(d.minutes(), 'minutes');
          }
          const diffHours = diff.hours();
          const diffMins = diff.minutes();
          if (idx > 0 && from.isBefore(moment(flight[idx - 1].arrivalTime, "HH:mm"))) {
            date.add(1, 'days');
          }
          return (
            <div key={f.flightId} className="card mb-3">
              <div className="card-body text-indigo">
                <div className="card-title row text-indigo align-items-center justify-content-between border-bottom">
                  <h5 className="col-6 col-md-4">
                    <span>
                      { f.departureAirport }
                    </span>
                    <span className="arrow-right mx-3" style={{ verticalAlign: 'center', transform: 'translateX(2px)' }} />
                    <span>
                      { f.arrivalAirport }
                    </span>
                  </h5>
                  <h6 className="col-6 col-md-2 text-end text-md-center">
                    { f.flightId }
                  </h6>
                  <h6 className="col-12 col-md-6 text-start text-md-end">
                    { date.format("ddd, MMM DD, YYYY") }
                  </h6>
                </div>
                <div className="row px-2">
                  <div className="d-flex flex-column text-center pe-0 col-auto" style={{ width: '4rem' }}>
                    <span>
                      { f.departureTime }
                    </span>
                    <svg height="80" width="6" style={{ margin: '0 auto' }}>
                      <rect x="2.5" y="0" height="80" width="1" />
                      <rect width="6" height="6" />
                      <rect y="74" width="6" height="6" />
                    </svg>
                    <span>
                      { f.arrivalTime }
                    </span>
                  </div>
                  <div className="d-flex flex-column justify-content-between align-items-center text-start ps-0 col-auto" style={{ width: '4rem' }}>
                    <span>{ f.departureAirport }</span>
                    <span style={{ fontSize: '0.8rem' }}>
                      { `${diffHours ? diffHours + 'h' : ''}${diffMins}m` }
                    </span>
                    <span>{ f.arrivalAirport }</span>
                  </div>
                  <div className="d-flex flex-column text-start col justify-content-between" style={{ fontSize: '0.8rem' }}>
                    <span>Operated by American Airline</span>
                    <div>
                      <div className="fw-bold">Meal Services</div>
                      <div>Snacks, Drinks, Food for Purchase, Snacks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
    </>
  );
};

const FlightSearchRow = ({ flight = [], searchDate, numOfPassenger }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  if (flight.length === 0)
    return null;

  const from = moment(flight[0].departureTime, "HH:mm");
  const to = moment(flight[flight.length - 1].arrivalTime, "HH:mm");
  let dayOffset = 0;
  flight.reduce((a, b) => {
    const _b = moment(b.departureTime, "HH:mm");
    const _a = moment(a.arrivalTime, "HH:mm");
    dayOffset += _b.isBefore(_a);
    return b;
  });
  let diff;
  if (to.isAfter(from)) {
    diff = to.subtract(from.hours(), 'hours').subtract(from.minutes(), 'minutes');
  } else {
    const d = moment("00:00", "HH:mm").subtract(from.hours(), 'hours').subtract(from.minutes(), 'minutes');
    diff = to.add(d.hours(), 'hours').add(d.minutes(), 'minutes');
  }
  const diffHours = diff.hours() + dayOffset * 24;
  const diffMins = diff.minutes();
  const svgXPos = ['5'];
  const airports = flight.map(f => f.departureAirport);
  airports.push(flight[flight.length - 1].arrivalAirport);
  if (flight.length > 1) {
    const step = 95.0 / flight.length;
    for (let i = 1; i <= flight.length; i++) {
      svgXPos.push(`${step * i}%`);
    }
  } else {
    svgXPos.push('95%');
  }
  const displayDiff = `${diffHours ? diffHours + 'h' : ''}${diffMins}m`;
  const handleTicketPurchase = () => {
    const id = Math.random().toString(36).substring(3);
    window.sessionStorage.setItem(id, JSON.stringify({
      flight,
      date: searchDate,
      duration: displayDiff,
      numOfPassenger: Number(numOfPassenger),
    }));
    navigate(`/trip-summary?session=${id}`);
  };
  
  return (
    <div className="d-flex mb-3">
      { /* card starts here */ }
      <div className="card flight-info-card col-md-6">
        <div className="card-body">
          <div className="d-flex justify-content-between card-search-info">
            <span>
              {
                flight.map(f => f.flightId).join(', ')
              }
            </span>
            <span>
              {
                displayDiff
              }
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-light">
              {
                moment(flight[0].departureTime, "HH:mm").format("H:mmA")
              }
            </h2>
            <i className="card-icon">
              <AirplaneSvg />
            </i>
            <h2 className="fw-light">
              {
                moment(flight[flight.length - 1].arrivalTime, "HH:mm").format("H:mmA")
              }
            </h2>
          </div>
          <svg height="30" width="100%">
            <rect x="10px" y="4" width="95%" height="0.7" />
            {
              airports.map((airport, i) => (
                <svg
                  key={`${airport}_${i}`}
                  x={svgXPos[i]}
                >
                  <rect width="8" height="8" transform="translate(5)"/>
                  <text y="20" x="-1" style={{ fontSize: '0.8rem' }}>
                    { airport }
                  </text>
                </svg>
              ))
            }
          </svg>
        </div>
        <div
          className="card-footer btn btn-link text-decoration-none text-start py-1 px-2 fs-6 fw-light"
          onClick={() => { setShow(true) }}
        >
          Details
        </div>
      </div>
      { /* card ends here */ }
      <div
        className="card card-price price-eco col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center"
        onClick={handleTicketPurchase}
      >
        $1,781
      </div>
      <div
        className="card card-price price-biz col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center"
        onClick={handleTicketPurchase}
      >
        $2,077
      </div>
      <div
        className="card card-price price-first col-md-2 d-none d-sm-none d-md-flex justify-content-center align-items-center"
        onClick={handleTicketPurchase}
      >
        $3,365
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Body>
          <FlightDetails flight={flight} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const FlightSearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const getSearchResult = useCallback(async () => {
    const dep = searchParams.get('dep');
    const arr = searchParams.get('arr');
    const stops = searchParams.get('stops') || 3;
    const result = await fetch(`/api/flight-search?dep=${dep}&arr=${arr}&stops=${stops}`).then(r => r.json());
    setFlights(result);
  }, [setFlights, searchParams]);

  useEffect(() => {
    getSearchResult();
  }, [getSearchResult]);

  const searchDate = searchParams.get('date') || moment().format('YYYY-MM-DD');
  const numOfPassenger = searchParams.get('numOfPassenger') || 1;
  const displayDate = moment(searchDate, "YYYY-MM-DD").format("ddd, MMM DD, YYYY");
  return (
    <div className="p-3">
      { flights.length ? (
          <>
            <div className="d-flex">
              <div className="col-md-6">
                <h4>
                  { displayDate }
                </h4>
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
            {
              flights.map((flight, i) => (
                <FlightSearchRow
                  key={`${i}_${Math.random().toString(36).substr(4)}`}
                  flight={flight}
                  searchDate={searchDate}
                  numOfPassenger={numOfPassenger}
                />
              ))
            }
          </>
        ) : (
          <div>
            We are not able to find any flight from {searchParams.get('dep')} to {searchParams.get('arr')}.
          </div>
        )
      }
    </div>
  );
};

export default FlightSearchResult;