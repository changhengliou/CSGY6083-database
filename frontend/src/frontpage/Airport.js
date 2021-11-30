import React, { useState, useEffect, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const Airport = (props) => {
  const [tableData, setTableData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [updateForm, setUpdateForm] = useState(null);

  const getAirports = useCallback(async () => {
    const airports = await fetch("/api/airport").then(r => r.json());
    setTableData(airports);
  }, [setTableData]);

  useEffect(() => {
    getAirports();
  }, [getAirports]);

  useEffect(() => {
    if (updateForm) {
      const form = document.forms["airport-form"];
      form.code.value = updateForm.code;
      form.city.value = updateForm.city;
      form.country.value = updateForm.country;
      form.name.value = updateForm.name;
      form.type.value = updateForm.type;
    }
  }, [updateForm]);

  const resetForm = (shouldRequest = true) => {
    setUpdateForm(null);
    setValidated(false);
    document.forms["airport-form"].reset();
    if (shouldRequest) getAirports();
  };

  const onFormSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }
    const resp = await fetch("/api/airport", {
      method: updateForm ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: form.code.value,
        city: form.city.value,
        country: form.country.value,
        name: form.name.value,
        type: form.type.value
      })
    });
    if (!resp.ok) {
      alert("Error");
    } else {
      resetForm();
    }
  };

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
              resetForm(false);
              setUpdateForm(tableData.find(airport => airport.code === clickId));
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={async e => {
              const clickId = e.currentTarget.parentElement.getAttribute("data-id");
              const resp = await fetch(`/api/airport?code=${clickId}`, {
                method: "DELETE"
              });
              if (!resp.ok) {
                alert(`Error: ${resp.status}`);
              } else {
                resetForm();
              }
            }}
          >
            Delete
          </button>
        </>
      )
    },
  ];

  return (
    <div className="p-3 row">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>
          {updateForm ? `Update ${updateForm.name}` : 'Create an Airport'}
        </h5>
        <Form name="airport-form" noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group>
            <Form.Control
              required
              disabled={!!updateForm}
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
              placeholder="City (Ex: New York)"
              name="city"
            />
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Country (Ex: United States)"
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
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-sm btn-primary col-12">Submit</button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary col-12"
                  onClick={() => { resetForm(false) }}
                >
                  Cancel
                </button>
              </div>
            </div>
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
    </div>
  );
};

export default Airport;
