import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowSvg } from "../icons/arrow.svg";
import "./mytrip.scss";

const MyTrip = () => {
  const CURR_FORM = 'search-form';
  const navigate = useNavigate();
  return (
    <form name="search-form" className="bg-dark text-light row justify-content-center align-items-center px-5 pt-4 pb-5">
        <div className="row col-11 justify-content-center align-items-end" style={{ maxWidth: '800px' }}>
          <div className="col-12 col-md-4">
            <div className="search-bar-hint">Find Your Trip</div>
            <input
              className="form-input"
              type="text"
              placeholder="Confirmation Number"
              name="customerId"
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              className="form-input"
              type="text"
              placeholder="First Name"
              name="fName"
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              className="form-input"
              type="text"
              placeholder="Last Name"
              name="lName"
            />
          </div>
        </div>
      <div className="col-1">
        <button
          type="button"
          className="submit-btn d-flex justify-content-center align-items-center"
          onClick={() => {
            const form = document.forms[CURR_FORM];
            const customerId = form.customerId.value;
            const fName = form.fName.value;
            const lName = form.lName.value;
            const params = new URLSearchParams();
            if (fName) params.append("fName", fName);
            if (lName) params.append("lName", lName);
            navigate(`/trip/${customerId}?${params.toString()}`); 
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
