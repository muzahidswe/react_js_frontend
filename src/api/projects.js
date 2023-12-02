import axios from 'axios';
// import {API} from '../backend';
import { baseURL } from '../constants/constants'; 

const url = `${baseURL}/projects`;

export const fetchProjects = () => axios.get(url);

export const fetchProjectDetails = (id) => axios.get(`${url}/${id}`);

export const createProject = (newProject) => axios.post(url, newProject);

export const updateProject = (id, updatedProject) => axios.patch(`${url}/${id}`, updatedProject);

export const deleteProject = (id) => axios.delete(`${url}/${id}`);
