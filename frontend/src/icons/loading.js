const Loading = () => {
  return (
    <div
      className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        opacity: '0.8',
        zIndex: '100'
      }}
    >
      {
        new Array(5).fill(0).map((_, i) => (
          <div key={i} className="spinner-grow me-2 text-white" role="status" />
        ))
      }
    </div>
  );
};

export default Loading;
