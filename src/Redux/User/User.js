const initialState = {
  name: '',
  email: '',
  photo: '',
  phone: '',
  id: null,
  board: '',
  standard: '',
  dob: {
    day: '',
    month: '',
    year: '',
  },
  accessToken: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USER_DATA_UPDATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state
  }
}

