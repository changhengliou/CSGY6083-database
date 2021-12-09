import { useState, useEffect, useCallback, useRef } from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import Table from "./Table";

const Membership = () => {
  const endDateRef = useRef();
  const [airlines, setAirlines] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState('');
  const [selectedMembership, setSelectedMembership] = useState('');
  const [members, setMembers] = useState([]);
  const getAirlines = async () => {
    return await fetch("/api/airline").then(r => r.json());
  };
  const getMemberships = async (airlineId) => {
    if (!airlineId) return;
    return await fetch(`/api/membership/${airlineId}`).then(r => r.json());
  };
  const getMembers = useCallback(async () => {
    if (!selectedMembership) return;
    const data = await fetch(`/api/member/${selectedMembership}`).then(r => r.json());
    setMembers(data || []);
  }, [setMembers, selectedMembership]);

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    (async () => {
      const airlines = await getAirlines();
      setAirlines(airlines);
      if (!airlines || !airlines.length) return;
      setSelectedAirline(airlines[0].airlineId);
    })();
  }, [setAirlines]);

  useEffect(() => {
    (async () => {
      const memberships = await getMemberships(selectedAirline);
      setMemberships(memberships || []);
      if (memberships && memberships.length > 0) {
        setSelectedMembership(memberships[0].membershipId);
      }
    })();
  }, [selectedAirline]);

  useEffect(() => {
    getMembers();
  }, [selectedMembership])

  const onCreateMember = async () => {
    let status = 200;
    try {
      const resp = await fetch('/api/member', {
        method: 'POST',
        body: JSON.stringify({
          memberEndDate: endDateRef.current.value, 
          membership: {
            membershipId: selectedMembership,
          }
        })
      });
      status = resp.status;
      getMembers();      
    } catch (err) {
      alert(`Error: ${status}`);
    }
  };

  const onDeleteMember = async () => {

  };

  const columns = [
    {key: "memberId", label: "Member ID"},
    {key: "memberStartDate", label: "Start Date"},
    {key: "memberEndDate", label: "End Date"},
    {
      label: "Action", 
      element: (
        <>
          <button className="btn btn-sm btn-danger" onClick={onDeleteMember}>
            Delete
          </button>
        </>
      )
    },
  ];

  return (
    <div className="px-4 py-3 d-flex">
      <div className="col-sm-4 col-md-3 card mb-3 me-3">
        <div className="card-body col-auto">
          <div className="row">
            <div className="col">
              <label style={{ fontSize: '0.8rem' }}>Airline</label>
              <Form.Select
                size="sm"
                value={selectedAirline}
                onChange={(e) => {
                  setSelectedAirline(e.currentTarget.value);
                }}
              >
                {
                  (airlines || []).map(({ airlineId, name }) => (
                    <option key={airlineId} value={airlineId}>
                      {name}
                    </option>
                  ))
                }
              </Form.Select>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label style={{ fontSize: '0.8rem' }}>Membership</label>
              <Form.Select
                size="sm"
                value={selectedMembership}
                onChange={(e) => {
                  setSelectedMembership(e.currentTarget.value);
                }}
              >
                {
                  (memberships || []).map(({ membershipId, membershipName }) => (
                    <option key={membershipId} value={membershipId}>
                      {membershipName}
                    </option>
                  ))
                }
              </Form.Select>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col">
              <label style={{ fontSize: '0.8rem' }}>Membership Expired Date</label>
              <input
                ref={endDateRef}
                className="form-control form-control-sm"
                type="date"
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <button
                className="w-100 btn btn-sm btn-primary"
                onClick={onCreateMember}
              >
                Create New Member
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-8 col-md-9 p-3 overflow-auto">
        <Table
          rowKey="memberId"
          className="text-center"
          columns={columns}
          data={members}
        />
      </div>
    </div>
  );
};

export default Membership;
