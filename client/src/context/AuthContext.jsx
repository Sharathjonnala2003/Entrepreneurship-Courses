import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to set auth token
  const setAuthToken = (token) => {
    if (token) {
      console.log('Setting auth token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      console.log('Removing auth token');
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Check if user is logged in on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log('Checking if user is logged in...');
        // First try to get token from localStorage
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          console.log('Found token in localStorage');
          setAuthToken(storedToken);

          try {
            // Attempt to get current user with the token
            const res = await axios.get('/auth/me', {
              withCredentials: true
            });

            if (res.data) {
              console.log('User authenticated:', res.data);
              setUser(res.data);
              setAuthError(null);
            }
          } catch (apiError) {
            console.error('API error during auth check:', apiError.response?.data || apiError.message);
            // Clear invalid token
            setUser(null);
            setAuthToken(null);
          }
        } else {
          console.log('No token found in localStorage');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Make sure our axios interceptors are correctly set up for handling 401 responses
  useEffect(() => {
    // Add response interceptor for 401 handling
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // If we get a 401 Unauthorized error, it means our token is invalid
        if (error.response && error.response.status === 401) {
          console.log('Received 401 response, logging out user');
          setUser(null);
          setAuthToken(null);
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Register user
  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await axios.post('/auth/register', userData, {
        withCredentials: true
      });

      console.log('Registration successful:', res.data);

      if (res.data.token) {
        setAuthToken(res.data.token);
        setUser(res.data);
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.error || 'Registration failed';
      setAuthError(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }
  };

  // Login user
  const login = async (userData) => {
    setAuthError(null);
    try {
      console.log('Attempting login with:', userData.email);

      const res = await axios.post('/auth/login', userData, {
        withCredentials: true
      });

      console.log('Login successful:', res.data);

      if (res.data && res.data.token) {
        setAuthToken(res.data.token);
        setUser(res.data);
        return { success: true };
      } else {
        console.error('Login response missing token');
        setAuthError('Authentication error: Missing token');
        return {
          success: false,
          error: 'Authentication error: Missing token'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setAuthError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      console.log('Logging out user');
      // Call the logout endpoint to clear cookies
      await axios.post('/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear client-side auth state
      setUser(null);
      setAuthToken(null);
      setAuthError(null);
      return { success: true };
    }
  };

  // Check if user is admin - improved function with better logging
  const isAdmin = () => {
    console.log('Checking admin status for user:', user?.email);
    console.log('User role:', user?.role);
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      register,
      login,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
