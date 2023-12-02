import * as api from '../api/projects';

export const FiSet = (selectedFi) => async(dispatch) => {
  try {
    // const { data } = await api.createProject(project);
    await dispatch({ type: 'SET_SELECTED_FI', payload: selectedFi });
  } catch (error) {
    console.log(error.message);
  }
}
