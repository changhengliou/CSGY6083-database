import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowSvg } from "../icons/arrow.svg";
import "./mytrip.scss";

const MyTrip = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-dark text-light row justify-content-center align-items-center px-5 pt-4 pb-5">
      <div className="row col-11 justify-content-center align-items-end" style={{ maxWidth: '800px' }}>
        <div className="col-12 col-md-4">
          <div className="search-bar-hint">Find Your Trip</div>
          <input
            className="form-input"
            type="text"
            placeholder="Confirmation Number"
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            className="form-input"
            type="text"
            placeholder="First Name"
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            className="form-input"
            type="text"
            placeholder="Last Name"
          />
        </div>
      </div>
      <div className="col-1">
        <button
          className="submit-btn d-flex justify-content-center align-items-center"
          onClick={() => { navigate("/flight-search/result"); }}
        >
          <ArrowSvg />
        </button>
      </div>
    </div>
  );
};

const MyTripPage = () => {
  return (
    <div>
      <MyTrip />
      <div className="bg-trip-img"></div>
    </div>
  );
}

export default MyTripPage;
