import React, { useState } from 'react';
import moment from 'moment';
import { Form, Modal } from 'react-bootstrap';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import { ReactComponent as ArrowSvg } from "../icons/arrow.svg";
import "react-dates/lib/css/_datepicker.css";
import "./bookflight.scss";

const AirportSelector = (props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="d-inline-flex flex-column">
      <div className="airport-selector-display fs-1 m-auto">{props.default}</div>
      <small className="airport-selector-hint m-auto">{props.hint}</small>
      <Modal show={show} onHide={() => { setShow(false); }} animation={false}>
        <Modal.Body>
          Airport search box should be here 
        </Modal.Body>
      </Modal>
    </div>
  );
};

const BookFlight = () => {
  const [focused, setFocused] = useState(false);
  const [date, setDate] = useState(moment());
  return (
    <div className="bg-dark text-light">
      <div className="flight-select row pt-3 pb-4 mx-auto">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <AirportSelector default="FROM" hint="Your Origin"/>
          <i className="dest-arrow mx-5">
            <ArrowSvg />
          </i>
          <AirportSelector default="TO" hint="Your Destination"/>
        </div>
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <SingleDatePicker
            date={date}
            focused={focused}
            onFocusChange={() => setFocused(!focused)}
            onDateChange={setDate}
            numberOfMonths={1}
          />
          <Form.Select aria-label="Number of passenger"> 
            {
              [1,2,3,4,5,6,7,8,9].map(i => (
                <option
                  key={i}
                  value={`${i}`}
                >
                  {`${i} Passenger${i > 1 ? 's' : ''}`}
                </option>
              ))
            }
          </Form.Select>
        </div>
        <div className="col-md-1 d-flex align-items-center">
          <button className="submit-btn d-flex justify-content-center align-items-center">
            <ArrowSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

const BookFlightPage = () => {
  return (
    <div>
      <BookFlight />
      <div className="bg-img position-relative">
        <div 
          className="p-3 position-absolute bg-text"
          style={{ color: '#f3f3f3' }}
        >
          <h1>
            Your Journey Starts From Here
          </h1>
          <h5 className="mx-auto mb-1 ps-2">
            New York to London starts from $299
          </h5>
          <h5 className="mx-auto mb-1 ps-2">
            New York to Barcelona starts from $399
          </h5>
          <h5 className="mx-auto mb-1 ps-2">
            Learn more about our Christmas deals >>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default BookFlightPage;
