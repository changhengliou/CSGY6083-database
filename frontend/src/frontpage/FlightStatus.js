const FlightStatus = () => {
  const fetchFlightStatus = async () => {
    const queryParams = new URLSearchParams();
    queryParams.append('airlineId', '');
    queryParams.append('airport', '');
    queryParams.append('flightId', '');
    queryParams.append('page', '');
    queryParams.append('pageSize', '');
    const resp = await fetch(`/api/flight-status?${queryParams.toString()}`);
  };
  return (
    <div>Flight Status</div>
  )
};

export default FlightStatus;
