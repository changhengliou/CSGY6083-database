import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import "./flightsearchresult.scss";

const TripSummary = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trip, setTrip] = useState(null);
  const [searchDate, setSearchDate] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [insurancePlan, setInsurancePlan] = useState([]);

  const getMealPlans = useCallback(async () => {
    const plans = await fetch("/api/meal-plan").then(r => r.json());
    setMealPlans(plans || []);
  }, [setMealPlans]);
  const getSpecialRequests = useCallback(async () => {
    const requests = await fetch("/api/special-request").then(r => r.json());
    setSpecialRequests(requests || []);
  }, [setSpecialRequests]);
  const getInsurancePlan = useCallback(async () => {
    const plans = await fetch("/api/insurance-plan").then(r => r.json());
    setInsurancePlan(plans || []);
  }, [setInsurancePlan]);

  useEffect(() => {
    getMealPlans();
    getSpecialRequests();
    getInsurancePlan();
  }, [getMealPlans, getSpecialRequests, getInsurancePlan]);

  useEffect(() => {
    const sessionId = searchParams.get("session");
    const itinerary = JSON.parse(sessionStorage.getItem(sessionId));
    setTrip(itinerary.flight);
    setSearchDate(itinerary.date);
    setDuration(itinerary.duration);
  }, [searchParams, setTrip, setSearchDate, setDuration])

  const stops = trip && trip.length > 0 ? `${trip[0].departureAirport} - ${trip.map(el => el.arrivalAirport).join(' - ')}` : '';
  const flights = trip && trip.length > 0 ? trip.map(el => el.flightId).join(', ') : '';
  const displayDate = moment(searchDate, "YYYY-MM-DD").format("ddd, MMM DD, YYYY");

  return trip ? (
    <div className="p-4 text-indigo">
      <div className="row mb-3">
        <div className="col-12 col-md-8">
          <div className="fs-3 mb-3">
            Trip Summary
          </div>
          {/* warning card */}
          <div className="card card-body d-none d-md-block">
            <div className="fs-5">Book Confidently Now with No Change Fees Later</div>
            <div style={{ fontSize: '0.8rem' }}>
              Book your next trip now and enjoy more peace of mind with no change fees. 
              Excludes Basic Economy travel that departs after December 31, 2021. 
              <div className="btn btn-link text-decoration-none p-0 d-block text-start" style={{ fontSize: '0.8rem' }}>
                Terms apply.
              </div>
            </div>
          </div>
          <div className="card card-body mt-3">
            <div className="row justify-content-start align-items-baseline">
              <div className="col-8">
                { `${stops}, ` }
                <span style={{ fontSize: '0.8rem' }}>{ `${flights} (${duration})` }</span>
              </div>
              <div className="col-4">{ displayDate }</div>
            </div>
          </div>
        </div>
        {/* total amount */}
        <div className="col-12 col-md-4 mt-3">
          <div className="card card-body">
            <div className="fs-4">
              Trip Total
            </div>
            <small className="text-muted">
              1 Passenger
            </small>
            <div className="d-flex justify-content-between">
              <span>Flights</span>
              <span>$1326.97</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Insurances</span>
              <span>$109.89</span>
            </div>
            <div className="d-flex justify-content-between mt-2 border-top">
              <span>Amount Due</span>
              <span>$1798.35</span>
            </div>
            <div className="row mt-3">
              <div className="col">
                <button className="btn btn-primary form-control">
                  Confirm And Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Customer information */}
      <div className="row mb-3">
        <div className="col-12 col-md-8">
          <div className="card card-body">
            <div className="fs-4 mb-3">Enter Customer information</div>
            <Form noValidate>
              <Form.Group>
                <div className="row mb-3">
                  <div className="col-12">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="street (ex: 6 metrotech)"
                      name="street"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="City (ex: Brooklyn)"
                      name="city"
                    />
                  </div>
                  <div className="col-6">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Country (ex: United States)"
                      name="country"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Zipcode (ex: 10003)"
                      name="zipcode"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Phone country Code (ex: 1)"
                      name="phoneCountryCode"
                    />
                  </div>
                  <div className="col-8">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Phone Number (ex: 347222222)"
                      name="phone"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Emergency Contact First Name"
                      name="emerContactFirstName"
                    />
                  </div>
                  <div className="col-6">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Emergency Contact Last Name"
                      name="emerContactLastName"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Emergency Contact Phone country Code (ex: 1)"
                      name="emerContactCountryCode"
                    />
                  </div>
                  <div className="col-8">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Emergency Contact Phone Number (ex: 347222222)"
                      name="emerContactPhone"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Member ID (ex: 646233847)"
                      name="memberId"
                    />
                  </div>
                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      {/* Passenger information */}
      <div className="row">
        <div className="my-3 col-12 col-md-8">
          <div className="card card-body">
            <div className="fs-4 mb-3">Enter passenger information</div>
            <Form noValidate>
              <Form.Group>
                <div className="row">
                  <div className="col-4">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </div>
                  <div className="col-4">
                    <Form.Control
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Middle Name"
                      name="middleName"
                    />
                  </div>
                  <div className="col-4">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </div>
                </div>
                <div className="row align-items-end mb-3">
                  <div className="col-6">
                    <label style={{fontSize: '0.8rem'}}>
                      Date of Birth
                    </label>
                    <Form.Control
                      required
                      type="date"
                      className="form-control form-control-sm"
                      name="dateOfBirth"
                    />
                  </div>
                  <div className="col-6">
                    <Form.Select
                      required
                      type="date"
                      className="form-select form-select-sm"
                      name="gender"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Select>
                  </div>
                </div>
                <div className="row align-items-end">
                  <div className="col-12">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Nationality (ex: USA)"
                      name="nationality"
                    />
                  </div>
                </div>
                <div className="row align-items-end">
                  <div className="col-6">
                    <Form.Control
                      required
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Passport Number"
                      name="passportNum"
                    />
                  </div>
                  <div className="col-6">
                    <label style={{fontSize: '0.8rem'}}>
                      Passport expired date
                    </label>
                    <Form.Control
                      required
                      type="date"
                      className="form-control form-control-sm"
                      name="passportExpireDate"
                    />
                  </div>
                </div>
                <div className="row align-items-end">
                  <div className="col-6">
                    <label style={{fontSize: '0.8rem'}}>
                      Add an insurance plan
                    </label>
                    <Form.Select
                      required
                      className="form-select form-select-sm"
                      name="insurance"
                    >
                      <option value="">I don't need an insurance</option>
                      {
                        insurancePlan.map(el => (
                          <option key={el.planId} value={el.planId}>{el.name}</option>
                        ))
                      }
                    </Form.Select>
                  </div>
                  <div className="col-6">
                    <label style={{fontSize: '0.8rem'}}>
                      Add a meal plan
                    </label>
                    <Form.Select
                      required
                      className="form-select form-select-sm"
                      name="mealPlan"
                    >
                      <option value="">I don't want any meal</option>
                      {
                        mealPlans.map(el => (
                          <option key={el.id} value={el.id}>{ el.name }</option>
                        ))
                      }
                    </Form.Select>
                  </div>
                </div>
                <div className="row align-items-end">
                  <div className="col-12">
                    <label style={{fontSize: '0.8rem'}}>
                      Special request
                    </label>
                    <Form.Select
                      required
                      className="form-select form-select-sm"
                      name="mealPlan"
                    >
                      <option value="">I don't need any special request</option>
                      {
                        specialRequests.map(el => (
                          <option key={el.id} value={el.id}>{ el.name }</option>
                        ))
                      }
                    </Form.Select>
                  </div>
                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: 'calc(100vh - 81px)' }}>
      <div className="fs-2">We cound not find your search</div>
      <div className="fs-4">Please try again</div>
    </div>
  );
};

export default TripSummary;
