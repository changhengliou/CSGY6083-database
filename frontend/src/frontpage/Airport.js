import React, { useState, useEffect, useCallback } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const columns = [
  {key: "code", label: "Code"},
  {key: "name", label: "Name"},
  {key: "city", label: "City"},
  {key: "country", label: "Country"},
  {
    key: "type", 
    label: "Type",
    format: (row, field) => {
      if (row[field] === "D")
        return "Domestic";
      if (row[field] === "I")
        return "International";
      if (row[field] === "B")
        return "Domestic / International";
      return "";
    }
  },
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

const Airport = (props) => {
  const [tableData, setTableData] = useState([]);
  const [validated, setValidated] = useState(false);

  const getAirports = useCallback(async () => {
    const airports = await fetch("/api/airport").then(r => r.json());
    setTableData(airports);
  }, [setTableData]);

  useEffect(() => {
    getAirports();
  }, [getAirports]);

  const onFormSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
  };

  return (
    <div className="p-3 row">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>Create an Airport</h5>
        <Form noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group name="airport-form">
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Airport Code (Ex: JFK)"
              name="code"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Name (Ex: John F. Kennedy International Airport)"
              name="name"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Main Hub (Ex: New York)"
              name="city"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Headquarter (Ex: United States)"
              name="country"
            />
            <Form.Select
              required
              type="text"
              className="form-select form-select-sm mb-3"
              name="type"
            >
              <option value="D">Domestic</option>
              <option value="I">International</option>
              <option value="B">Domestic / International</option>
            </Form.Select>
            <button type="submit" className="btn btn-sm btn-primary col-12">Submit</button>
          </Form.Group>
        </Form>
      </div>
      <div className="col-md-12 col-lg-8 mb-3" style={{ maxHeight: '30rem', overflow: 'scroll' }}>
        <Table
          rowKey="code"
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

export default Airport;
