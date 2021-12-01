import React, { useState, useEffect, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import Table from "./Table";
import "./admin.scss";

const InsurancePlan = (props) => {
  const [tableData, setTableData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [updateForm, setUpdateForm] = useState(null);

  const getInsurancePlan = useCallback(async () => {
    const plans = (await fetch("/api/insurance-plan").then(r => r.json())) || [];
    setTableData(plans);
  }, [setTableData]);

  useEffect(() => {
    getInsurancePlan();
  }, [getInsurancePlan]);

  useEffect(() => {
    if (updateForm) {
      const form = document.forms["insurance-form"];
      form.name.value = updateForm.name;
      form.description.value = updateForm.description;
      form.costPerPassenger.value = updateForm.costPerPassenger;
    }
  }, [updateForm]);

  const resetForm = (shouldRequest = true) => {
    setUpdateForm(null);
    setValidated(false);
    document.forms["insurance-form"].reset();
    if (shouldRequest) getInsurancePlan();
  };

  const onFormSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!form.checkValidity()) {
      return;
    }
    const resp = await fetch("/api/insurance-plan", {
      method: updateForm ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        planId: updateForm ? updateForm.planId : null,
        name: form.name.value,
        description: form.description.value,
        costPerPassenger: Number(form.costPerPassenger.value),
      })
    });
    if (resp.ok) {
      resetForm();
    } else {
      alert("Error: " + resp.status);
    }
  };

  const columns = [
    {key: "planId", label: "Plan ID"},
    {key: "name", label: "Insurance Name"},
    {key: "description", label: "Description"},
    {key: "costPerPassenger", label: "Cost Per Passenger"},
    {
      label: "Action", 
      element: (
        <>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={e => {
              const clickId = e.currentTarget.parentElement.getAttribute("data-id");
              resetForm(false);
              setUpdateForm(tableData.find(plan => plan.planId === Number(clickId)));
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={async e => {
              const clickId = e.currentTarget.parentElement.getAttribute("data-id");
              const resp = await fetch(`/api/insurance-plan?planId=${clickId}`, {
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
    <div className="p-3 row col-auto">
      <div className="card me-3 col-md-12 col-lg-3 py-3 mb-3">
        <h5>
          { updateForm ? `Update ${updateForm.name}` : 'Create an Insurance Plan' }
        </h5>
        <Form name="insurance-form" noValidate validated={validated} onSubmit={onFormSubmit}>
          <Form.Group>
            <label style={{fontSize: '0.8rem'}}>
              Plan Name
            </label>
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm"
              name="name"
            />
            <label style={{fontSize: '0.8rem'}}>
              Description
            </label>
            <Form.Control
              required
              type="text"
              className="form-control form-control-sm"
              name="description"
            />
            <label style={{fontSize: '0.8rem'}}>
              Cost Per Passenger
            </label>
            <Form.Control
              required
              type="decimal"
              className="form-control form-control-sm mb-3"
              name="costPerPassenger"
            />
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-sm btn-primary col-12">Submit</button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary col-12"
                  onClick={() => { resetForm(false); }}
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
          rowKey="planId"
          className="text-center"
          columns={columns}
          data={tableData}
        />
      </div>
    </div>
  );
};

export default InsurancePlan;
