import React, { useState, useEffect, useCallback } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const columns = [
  {key: "airlineId", label: "ID"},
  {key: "name", label: "Name"},
  {key: "mainHub", label: "Main Hub"},
  {key: "headQuarter", label: "Headquarter"},
  {key: "country", label: "Country"},
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

  const getAirlines = useCallback(async () => {
    const airlines = await fetch("/api/airline").then(r => r.json());
    setTableData(airlines);
  }, [setTableData]);

  useEffect(() => {
    getAirlines();
  }, [getAirlines]);

  const onFormSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
  };

  return (
    <div className="p-3 row">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>Create an Airline</h5>
        <Form noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group name="airline-form">
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Name (Ex: American Airlines)"
              name="name"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Main Hub (Ex: JFK)"
              name="mainHub"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Headquarter (Ex: NY)"
              name="headQuarter"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Country (Ex: USA)"
              name="country"
            />
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
