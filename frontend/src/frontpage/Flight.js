import React, { useState, useEffect, useCallback } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import moment from 'moment';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const columns = [
  {key: "flightId", label: "Flight ID"},
  {key: "departureAirport", label: "Departure Airport"},
  {key: "arrivalAirport", label: "Arrival Airport"},
  {
    key: "departureTime", 
    label: "Departure Time",
    format: (row, field) => moment(row[field], 'HH:mm').format('HH:mm')
  },
  {
    key: "arrivalTime", 
    label: "Arrival Time",
    format: (row, field) => moment(row[field], 'HH:mm').format('HH:mm')
  },
  {key: "airlineName", label: "Airline"},
  {
    label: "Action", 
    element: (
      <>
        <button
          className="btn btn-sm btn-primary me-2"
          onClick={e => {
            const clickId = e.currentTarget.parentElement.getAttribute("data-id");
            console.log(`Edit = ${clickId}`);
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={e => {
            const clickId = e.currentTarget.parentElement.getAttribute("data-id");
            console.log(`Delete = ${clickId}`);
          }}
        >
          Delete
        </button>
      </>
    )
  },
];

const Airline = (props) => {
  const [tableData, setTableData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);

  const getFlights = useCallback(async () => {
    const flights = (await fetch("/api/flight").then(r => r.json())) || [];
    flights.forEach(flight => {
      flight.airlineName = flight.airline?.name;
    });
    setTableData(flights);
  }, [setTableData]);
  const getAirlines = useCallback(async () => {
    const airlines = (await fetch("/api/airline").then(r => r.json())) || [];
    setAirlines(airlines);
  }, [setAirlines]);
  const getAirports = useCallback(async () => {
    const airports = (await fetch("/api/airport").then(r => r.json())) || [];
    setAirports(airports);
  }, [setAirports]);

  useEffect(() => {
    getFlights();
    getAirlines();
    getAirports();
  }, [getFlights, getAirlines, getAirports]);

  const onFormSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!form.checkValidity()) {
      return;
    }
    const resp = await fetch("/api/flight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        flightId: form.flightId.value,
        departureAirport: form.departureAirport.value,
        arrivalAirport: form.arrivalAirport.value,
        departureTime: form.departureTime.value,
        arrivalTime: form.arrivalTime.value,
        airline: {
          airlineId: Number(form.airlineId.value)
        }
      })
    }).then(r => r.json());
    console.log(resp);
  };

  return (
    <div className="p-3 row col-auto">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>Create a Flight</h5>
        <Form noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group name="airline-form">
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Flight ID (Ex: DL36)"
              name="flightId"
            />
            <Form.Select
              required
              type="text"
              className="form-select form-select-sm mb-3"
              name="departureAirport"
            >
              {
                airports.map((row, idx) => (
                  <option key={`${row.code}_${row.idx}`} value={row.code}>
                    {`${row.name} (${row.code})`}
                  </option>
                ))
              }
            </Form.Select>
            <Form.Select
              required
              type="text"
              className="form-select form-select-sm mb-3"
              name="arrivalAirport"
            >
              {
                airports.map((row, idx) => (
                  <option key={`${row.code}_${row.idx}`} value={row.code}>
                    {`${row.name} (${row.code})`}
                  </option>
                ))
              }
            </Form.Select>
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Departure Time (Ex: 13:45)"
              name="departureTime"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Arrival Time (Ex: 22:30)"
              name="arrivalTime"
            />
            <Form.Select
              required
              type="text"
              className="form-select form-select-sm mb-3"
              name="airlineId"
            >
              {
                airlines.map((row, idx) => (
                  <option key={`${row.airlineId}_${row.idx}`} value={row.airlineId}>
                    {row.name}
                  </option>
                ))
              }
            </Form.Select>
            <button type="submit" className="btn btn-sm btn-primary col-12">Submit</button>
          </Form.Group>
        </Form>
      </div>
      <div className="col-md-12 col-lg-8 mb-3" style={{ maxHeight: '30rem', overflow: 'scroll' }}>
        <Table
          rowKey="airlineId"
          className="text-center"
          columns={columns}
          data={tableData}
        />
      </div>
      {/* <SelectSearch
        options={options}
        value={selected}
        search
        filterOptions={fuzzySearch}
        placeholder="Select an airline"
        onChange={setSelected}
      /> */}
    </div>
  );
};

export default Airline;
