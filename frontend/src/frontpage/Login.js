import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const FAKE_ACCOUNT_ID = 'admin';
const FAKE_PASSWORD = '123456';

const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const accountIdRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSigIn = () => {
    const accountId = accountIdRef.current.value;
    const password = passwordRef.current.value;
    if (accountId === FAKE_ACCOUNT_ID && password === FAKE_PASSWORD) {
      signIn('admin', () => navigate('/admin/stats'));
    } else {
      alert('Invalid account ID or password');
    }
  };

  return (
    <div className="p-4">
      <div className="card w-50 m-auto mt-5">
        <h3 className="p-3 pb-0 mb-0">Administrator Login</h3>
        <div className="text-muted px-3">
          To use dashboard, you need to login.
        </div>
        <div className="card-body pt-0">
          <div className="row">
            <div className="col">
              <label style={{ fontSize: '0.8rem' }}>Account ID</label>
              <input type="text" ref={accountIdRef} className="form-control form-control-sm"/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label style={{ fontSize: '0.8rem' }}>Password</label>
              <input type="password" ref={passwordRef} className="form-control form-control-sm"/>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <button
                className="btn btn-sm btn-primary w-100"
                onClick={handleSigIn}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
