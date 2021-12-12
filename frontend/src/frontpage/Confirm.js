import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Loading from '../icons/loading';

const Confirm = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pathParams = useParams();
  const navigate = useNavigate();
  const customerId = searchParams.get('customerId') || pathParams.customerId;
  const memberId = searchParams.get('memberId');

  const fetchInfo = useCallback(async () => {
    try {
      if (memberId) {
        const resp = await fetch(`/api/itinerary/member/${memberId}`).then(r => r.json());
        setInfo(resp);
      } else {
        const resp = await fetch(`/api/itinerary/confirm/${customerId}`).then(r => r.json());
        setInfo(resp);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
    
  }, [setInfo]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  if (loading) {
    return <Loading />;
  }

  const summary = {};
  if (info && info.length) {
    const data = {};
    info.forEach(el => {
      const name = `${el.gender === 'M' ? 'Mr.' : 'Mrs.'} ${el.firstName} ${el.lastName}`;
      if (!(name in data))
        data[name] = [];
      data[name].push(el);
      summary[name] = {};
    });
    Object.keys(data).forEach(key => {
      const val = data[key];
      let routes = val[0].flight.departureAirport;
      let flights = val.map(el => el.flight.flightId).join(', ');
      val.forEach(el => {
        routes += " - " + el.flight.arrivalAirport;
      });
      summary[key]['passengerId'] = val[0].passengerId;
      summary[key]['routes'] = routes;
      summary[key]['flights'] = flights;
      summary[key]['date'] = val[0].date;
      summary[key]['cabinClass'] = val[0].cabinClass;
      summary[key]['mealPlan'] = val[0].mealPlan;
      summary[key]['specialRequest'] = val[0].specialRequest;
      summary[key]['insurancePlan'] = val[0].insurancePlan?.name;
    });
  }  

  return (
    <div
      className="margin-auto mt-3 p-4"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className="text-center">
        {
          !info || !info.length ? (
              <div>
                <h4>
                  Sorry, we are not able to find this itinerary.
                </h4>
                <h6 className="fw-normal">
                  Make sure that the { customerId ? 'confirmation' : 'member' } number you entered 
                  <span className="text-primary fw-bold"> ({ customerId || memberId })</span> is correct.
                </h6>
              </div>
            ) : (
            window.location.pathname.startsWith("/trip") ? null : (
              <div>
                <h4>
                  Congratulations, { info[0].lastName }! You have successfully booked your trip.
                </h4>
                <h5>
                  Your confirmation number is: <span className="fw-bolder text-primary">{ customerId }</span>
                </h5>
              </div>
            )
          )
        }
      </div>
      <div className="col-sm-12 col-md-8 col-lg-6 m-auto mt-3">
        {
          Object.keys(summary).map(key => (
            <div
              key={`${summary[key].routes}_${summary[key].passengerId}`}
              className="card card-body mt-3 m-auto"
            >
              <div className="d-flex justify-content-between fw-bold">
                <div>
                  { key }
                </div>
                <span>
                  { summary[key].date }
                </span>
              </div>
              <div
                className="d-flex justify-content-between align-items-baseline fw-bold"
                style={{ fontSize: '0.85rem' }}
              >
                <div>
                  <span>
                    { summary[key].routes }
                  </span>,&nbsp;
                  <span style={{ fontSize: '0.75rem' }}>
                    ({ summary[key].flights })
                  </span>
                </div>
                <div>
                  <span className="text-capitalize">
                    { summary[key].cabinClass } class
                  </span>
                </div>
              </div>
              <div
                className="d-flex just-fy-content-between align-items-baseline"
                style={{ fontSize: '0.85rem' }}
              >
                {
                  ['mealPlan', 'specialRequest', 'insurancePlan'].filter(el => summary[key][el]).map((el, idx) => (
                    summary[key][el] ? (
                      <span key={el} className={idx ? 'ms-3' : ''}>
                        { summary[key][el] }
                      </span>
                    ) : null
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-outline-primary" onClick={() => { navigate("/") }}>
          Book Another Trip
        </button>
      </div>
    </div>
  );
};

export default Confirm;
