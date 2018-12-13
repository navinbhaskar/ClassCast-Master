const initialState = {
  currentCourse: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_COURSE':
      return {
        ...state,
        currentCourse: action.payload,
      };
    default:
      return state;
  }
}

export const selectCourse = course => ({
  type: 'SELECT_COURSE',
  payload: course,
});