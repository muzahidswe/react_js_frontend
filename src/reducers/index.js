import { combineReducers } from 'redux';
import auth from './auth';
import fi from './fi';

export default combineReducers({ auth, fi });
