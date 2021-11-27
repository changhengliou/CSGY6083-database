import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Form, Modal } from 'react-bootstrap';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowSvg } from "../icons/arrow.svg";
import "react-dates/lib/css/_datepicker.css";
import "react-select-search/style.css";
import "./bookflight.scss";

const AirportSelector = (props) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div
        className="d-inline-flex flex-column"
        onClick={() => setShow(true)}
      >
        <div className="airport-selector-display fs-1 m-auto">
          { selected || props.default }
        </div>
        <small className="airport-selector-hint m-auto">{props.hint}</small>
      </div>
      <Modal
        centered
        show={show}
        onHide={() => { setShow(false); }}
        animation={false}
      >
        <Modal.Body>
          <SelectSearch
            options={props.options || []}
            value={selected}
            search
            filterOptions={fuzzySearch}
            placeholder="Search for an airport"
            onChange={(s) => {
              setSelected(s);
              setShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

const BookFlight = () => {
  const [focused, setFocused] = useState(false);
  const [date, setDate] = useState(moment());
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const getAirports = useCallback(async () => {
    const airports = await fetch("/api/airport").then(r => r.json());
    const airportOptions = airports.map(el => {
      return {
        value: el.code,
        name: `${el.city}, ${el.country} (${el.code})`,
        type: el.type
      };
    });
    setOptions(airportOptions);
  }, [setOptions]);
  useEffect(() => {
    getAirports();
  }, [getAirports]);
  
  return (
    <div className="bg-dark text-light">
      <div className="flight-select row pt-3 pb-4 mx-auto">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <AirportSelector default="FROM" hint="Your Origin" options={options}/>
          <i className="dest-arrow mx-5">
            <ArrowSvg />
          </i>
          <AirportSelector default="TO" hint="Your Destination" options={options}/>
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
          <button
            className="submit-btn d-flex justify-content-center align-items-center"
            onClick={() => { navigate("/flight-search/result"); }}
          >
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
