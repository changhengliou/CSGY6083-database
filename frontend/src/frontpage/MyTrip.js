import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { ReactComponent as ArrowSvg } from "../icons/arrow.svg";
import "./mytrip.scss";

const MyTrip = () => {
  const CURR_FORM = 'search-form';
  const navigate = useNavigate();
  return (
    <form name="search-form" className="bg-dark text-light row justify-content-center align-items-center px-5 pt-4 pb-5">
        <div className="row col-10 justify-content-center align-items-end" style={{ maxWidth: '800px' }}>
        <div className="col-12 col-md-4">
          <div className="search-bar-hint">Find Your Trip</div>
          <Form.Select
            size="sm"
            className="trip-select"
            name="option"
            style={{ width: '200px' }}
          >
            <option value="customerId">Confirmation Number</option>
            <option value="memberId">Member ID</option>
          </Form.Select>
        </div>
          <div className="col-12 col-md-4">
            <input
              className="form-input"
              type="text"
              name="input"
              style={{ width: '200px' }}
            />
          </div>
        </div>
      <div className="col-2">
        <button
          type="button"
          className="submit-btn d-flex justify-content-center align-items-center"
          onClick={() => {
            const form = document.forms[CURR_FORM];
            const option = form.option.value;
            const input = form.input.value;
            const params = new URLSearchParams();
            params.append(option, input);
            navigate(`/trip/search?${params.toString()}`); 
          }}
        >
          <ArrowSvg />
        </button>
      </div>
    </form>
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
