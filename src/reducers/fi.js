export default (fi = {
  selected_fi: null
}, action) => {
  switch (action.type) {
    case 'SET_SELECTED_FI':
      return {
        selected_fi: action.payload
      };
    default:
      return fi;
  }
}
