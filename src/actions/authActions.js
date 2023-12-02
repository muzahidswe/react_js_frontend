import * as api from '../api/auth';
import { returnErrors, clearErrors } from './errors';

export const getUser = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_LOADING' });

    api.fetchUser(tokenConfig(getState))
      .then(({data}) => {dispatch({ type: 'USER_LOADED', payload: data })})
      .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'AUTH_ERROR' });
      })
  } catch (error) {
    console.log(error);
  }
}

export const createUser = (user) => async (dispatch) => {
  try {
    const { data } = await api.createUser(user);
    dispatch({ type: 'REGISTER_SUCCESS', payload: data})
  } catch (error) {
    console.log(error);
  }
}

export const login = (user) => async (dispatch) => {
  try {
    api.loginUser(user)
      .then(({data}) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
        dispatch(clearErrors());
      })
      .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'LOGIN_FAIL' });
      })
  } catch (error) {
    console.log(error);
  }
}

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOGOUT_SUCCESS' });
  } catch (error) {
    console.log(error);
  }
}

export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
}
