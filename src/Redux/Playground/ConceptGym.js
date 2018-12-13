const initialState = {
  section: 1,
  selectedSubject: 'p',
  topics: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GO_TO_CONCEPT_SECTION':
      return {
        ...state,
        section: action.payload
      };
    case 'SELECT_CONCEPT_SUBJECT': {
      console.log(action.payload);
      return {
        ...state,
        selectedSubject: action.payload,
      };
    }
    case 'SELECT_CONCEPT_TOPICS': {
      return {
        ...state,
        topics: action.payload,
      };
    }
    default:
      return state;
  }
}

export const goToConceptSection = index => ({
  type: 'GO_TO_CONCEPT_SECTION',
  payload: index,
});

export const selectConceptSubject = subject => ({
  type: 'SELECT_CONCEPT_SUBJECT',
  payload: subject,
});

export const selectConceptTopics = topics => ({
  type: 'SELECT_CONCEPT_TOPICS',
  payload: topics,
});
