import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../redux/actions/authActions';

const AuthPersist = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return children;
};

export default AuthPersist;