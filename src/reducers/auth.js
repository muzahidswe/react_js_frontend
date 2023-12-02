export default (auth = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: null,
    user: null
  }, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...auth,
        isLoading: true
      };
    case 'USER_LOADED':
      return {
        ...auth,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...auth,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT_SUCCESS':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...auth,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return auth;
  }
}
