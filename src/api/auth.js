import axios from 'axios';
// import {API} from '../backend';

import { baseURL } from '../constants/constants'; 

const url = `${baseURL}`;

// get user info according to token
export const fetchUser = (config) => axios.get(`${url}/auth/user`, config);

// create a user
export const createUser = (user) => axios.post(`${url}/users`, user);

// login to get token
export const loginUser = (user) => axios.post(`${url}/auth`, user);
