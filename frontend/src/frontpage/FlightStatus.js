import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Pagination } from 'react-bootstrap';
import Table from "./Table";

const columns = [
  {key: "flightId", label: "Flight ID"},
  {key: "departureAirport", label: "Departure Airport"},
  {key: "arrivalAirport", label: "Arrival Airport"},
  {key: "departureTime", label: "Departure Time"},
  {key: "arrivalTime", label: "Arrival Time"},
  {key: "airlineName", label: "Airline"},
  {key: "departure", label: "Origin"},
  {key: "arrival", label: "Destination"},
];

const FlightStatus = () => {
  const CURR_FORM = 'flight-status-form';
  const PAGE_SIZE = 10;
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const inboundRef = useRef(null);
  const outboundRef = useRef(null);
  const getAirlines = useCallback(async () => {
    const airlines = await fetch("/api/airline").then(r => r.json());
    setAirlines(airlines);
  }, [setAirlines]);
  const getAirports = useCallback(async () => {
    const airports = await fetch("/api/airport").then(r => r.json());
    setAirports(airports);
  }, [setAirports]);

  const fetchFlightStatus = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const queryParams = new URLSearchParams();
    const form = document.forms[CURR_FORM];
    const airport = form.airport.value;    
    if (inboundRef.current.checked) {
      queryParams.append('arr', airport);
    } else if (outboundRef.current.checked) {
      queryParams.append('dep', airport);
    }
    queryParams.append('airlineId', form.airline.value);
    queryParams.append('flightId', form.flightId.value);
    queryParams.append('page', page);
    queryParams.append('pageSize', PAGE_SIZE);
    try {
      const resp = await fetch(`/api/flight-status?${queryParams.toString()}`).then(r => r.json());
      setTableData((resp || []).map(row => ({
        flightId: row.flightId,
        departureAirport: row.departureAirport,
        arrivalAirport: row.arrivalAirport,
        departureTime: row.departureTime,
        arrivalTime: row.arrivalTime,
        airlineName: row.airline.name,
        departure: `${row.departureCity}, ${row.departureCountry}`,
        arrival: `${row.arrivalCity}, ${row.arrivalCountry}`,
      })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFlightStatus();
    })();
  }, [page]);

  useEffect(() => {
    getAirlines();
    getAirports();
    outboundRef.current.checked = true;
  }, [getAirlines, getAirports]);
  
  return (
    <div className="p-4 m-auto">
      <div className="row align-items-center justify-content-around">
        <div className="col-10">
          <Form
            name={CURR_FORM}
            noValidate
            onSubmit={fetchFlightStatus}
          >
            <div className="row align-items-center m-auto mb-3" style={{ maxWidth: '768px' }}>
              <div className="col-auto">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="in-out-bound" id="out-bound" ref={outboundRef}/>
                  <label className="form-check-label" htmlFor="out-bound">
                    Departure
                  </label>
                </div>
              </div>
              <div className="col-auto">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="in-out-bound" id="in-bound" ref={inboundRef}/>
                  <label className="form-check-label" htmlFor="in-bound">
                    Arrival
                  </label>
                </div>
              </div>
              <div className="col-auto">
                Airport: 
              </div>
              <div className="col-auto" style={{ maxWidth: '25%' }}>
                <Form.Select type="select" className="form-select form-select-sm" name="airport">
                  <option value="">All</option>
                  {
                    airports.map(({ code, name }) => (
                      <option
                        key={code}
                        value={code}
                      >
                        { name }
                      </option>
                    ))
                  }
                </Form.Select>
              </div>
            </div>
            <div className="row align-items-center m-auto" style={{ maxWidth: '768px' }}>
              <div className="col-auto" style={{ maxWidth: '25%' }}>
                Airline: 
              </div>
              <div className="col-auto">
                <Form.Select type="select" className="form-select form-select-sm" name="airline">
                  <option value="">All</option>
                  {
                    airlines.map(({ airlineId, name }) => (
                      <option
                        key={airlineId}
                        value={airlineId}
                      >
                        { name }
                      </option>
                    ))
                  }
                </Form.Select>
              </div>
              <div className="col-auto">
                Flight ID:
              </div>
              <div className="col-auto">
                <input name="flightId" type="text" className="form-control form-control-sm" placeholder="Flight ID (ex: AA123)"/>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={fetchFlightStatus}>Search</button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <Table
            rowKey="flightId"
            className="text-center"
            style={{ minHeight: '15rem', maxHeight: '20rem' }}
            columns={columns}
            data={tableData}
          />
        </div>
        <div className="d-flex mt-3 justify-content-around">
          <button
            className="btn btn-outline-primary"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={tableData.length < PAGE_SIZE}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
};

export default FlightStatus;
