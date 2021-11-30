import React, { useState, useEffect, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const Airline = (props) => {
  const [tableData, setTableData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [updateForm, setUpdateForm] = useState(null);

  const getAirlines = useCallback(async () => {
    const airlines = await fetch("/api/airline").then(r => r.json());
    setTableData(airlines);
  }, [setTableData]);

  useEffect(() => {
    getAirlines();
  }, [getAirlines]);

  useEffect(() => {
    if (updateForm) {
      const form = document.forms["airline-form"];
      form.name.value = updateForm.name;
      form.mainHub.value = updateForm.mainHub;
      form.headQuarter.value = updateForm.headQuarter;
      form.country.value = updateForm.country;
    }
  }, [updateForm]);

  const resetForm = (doRequest = true) => {
    document.forms["airline-form"].reset();
    setValidated(false);
    setUpdateForm(null);
    if (doRequest) getAirlines();
  };

  const onEditAirline = e => {
    const clickId = e.currentTarget.parentElement.getAttribute("data-id");
    resetForm(false);
    setUpdateForm(tableData.find(airline => airline.airlineId === Number(clickId)));
  };

  const onDeleteAirline = async e => {
    const clickId = e.currentTarget.parentElement.getAttribute("data-id");
    const resp = await fetch(`/api/airline?airlineId=${clickId}`, {
      method: "DELETE"
    });
    if (!resp.ok) {
      alert(`Error: ${resp.status}`);
    } else {
      resetForm();
    }
  };

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
            onClick={onEditAirline}
          >
            Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={onDeleteAirline}>
            Delete
          </button>
        </>
      )
    },
  ];

  const onFormSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }
    const resp = await fetch("/api/airline", {
      method: updateForm ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        airlineId: updateForm ? updateForm.airlineId : null,
        name: form.name.value,
        mainHub: form.mainHub.value,
        headQuarter: form.headQuarter.value,
        country: form.country.value
      })
    });
    if (!resp.ok) {
      alert("Error");
    } else {
      resetForm();
    }
  };

  return (
    <div className="p-3 row">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>
          {updateForm ? `Update ${updateForm.name}` : 'Create an Airline'} 
        </h5>
        <Form name="airline-form" noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group>
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
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-sm btn-primary col-12">Submit</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-sm btn-secondary col-12" onClick={() => { resetForm(false) }}>Cancel</button>
              </div>
            </div>
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
    </div>
  );
};

export default Airline;
