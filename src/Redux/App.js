const initialState = {
  portrait: true,
  notifications: false,
  modal: null,
  challengeId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ORIENTATION_CHANGE':
      return {
        ...state,
        portrait: action.payload,
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      };
    case 'SHOW_MODAL':
      return {
        ...state,
        modal: action.payload,
      };
    case 'SET_CHALLENGE_ID':
      return {
        ...state,
        challengeId: action.payload,
      };
    default:
      return state;
  }
}

export const changeOrientation = orientation => ({
  type: 'ORIENTATION_CHANGE',
  payload: orientation,
});

export const toggleNotifications = state => ({
  type: 'TOGGLE_NOTIFICATIONS',
  payload: state,
});

export const showModal = modal => ({
  type: 'SHOW_MODAL',
  payload: modal,
});

export const setChallengeId = cid => ({
  type: 'SET_CHALLENGE_ID',
  payload: cid,
});