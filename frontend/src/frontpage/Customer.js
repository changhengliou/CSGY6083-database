import { useEffect, useState } from 'react';
import Table from "./Table";


const columns = [
  {key: "invoiceNumber", label: "Invoice #"},
  {key: "date", label: "Transaction Date"},
  {key: "amount", label: "Amount"},
];

const Customer = () => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    (async() => {
      const resp = await fetch("/api/stats").then(r => r.json());
      setInfo(resp);
    })();
  }, [setInfo]);

  return (
    <div className="p-3">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="mb-1">
                <h6 className="mb-0">Customers Who Fly Today</h6>
                { 
                  <span style={{ fontSize: '0.8rem' }}>{ (info.flightTodayInfo || []).join(", ") || 'N/A' }</span>
                }
              </div>
              <div className="mb-1">
                <h6 className="mb-0">Most Popular Insurance Plan With Price &#8805; $100</h6>
                <span style={{ fontSize: '0.8rem' }}>{ info.mostPopInsGreat || 'N/A' }</span>
              </div>
              <div className="mb-1">
                <h6 className="mb-0">Most Popular Insurance Plan With Price &lt; $100</h6>
                <span style={{ fontSize: '0.8rem' }}>{ info.mostPopInsSmall || 'N/A' }</span>
              </div>
              <div className="mb-1">
                <h6 className="mb-0">Top 10 Members Who Booked The Most Flights</h6>
                <span style={{ fontSize: '0.8rem' }}>{ (info.topMembers || []).join(', ') || 'N/A' }</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h6>Payments</h6>
              <Table
                rowKey="memberId"
                className="text-center"
                columns={columns}
                data={info.invoices || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
