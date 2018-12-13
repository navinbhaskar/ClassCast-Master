const initialState = {
  menuOpen: false,
  currentSection: [0, 0],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GO_TO':
      return {
        ...state,
        currentSection: action.payload
      };
    case 'MENU_OPEN':
      return {
        ...state,
        menuOpen: true,
      };
    case 'MENU_CLOSE':
      return {
        ...state,
        menuOpen: false,
      };
    default:
      return state;
  }
}