import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    if (token && !user && !isLoading) {
      dispatch(fetchProfile());
    }
  }, [token, user, isLoading, dispatch]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated && !!user,
    loading: isLoading
  };
};
