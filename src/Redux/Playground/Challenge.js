const initialState = {
  section: 0,
  questions: 10,
  to: '',
  chl_class: 11,
  subject: '',
  chapter: '',
  requestInfo: {},
  received: false,
  id: '',
  qa: [
    {
      question: 'A die is rolled. What is the probability that an even number is obtained?',
      answers: [
        'masdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmcmasdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmcmasdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmcmasdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmcmasdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmcmasdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmc',
        'skakdnao odm oaisdmoasmd aosdm amdoi asmdoia mdoiasm doiams',
        'masdmn asndk asmdlk amsklma lskm aklsm laksml askmklasm laksmc',
        'skakdnao odm oaisdmoasmd aosdm amdoi asmdoia mdoiasm doiams',
      ]
    },
  ],
  reviewMode: false,
  answers: [],
  correctAnswers: [],
  currentIndex: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_NAVIGATOR_CAROUSEL': {
      return {
        ...state,
        navigatorCarousel: action.payload,
      };
    }
    case 'GO_TO_CHALLENGE_SECTION':
      return {
        ...state,
        section: action.payload
      };
    case 'UPDATE_CHALLENGE_REQUEST': {
      return {
        ...state,
        ...action.payload,
      }
    }
    case 'SET_ANSWERS': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'MARK_OPTION': {
      let answers = state.answers;
      answers[action.payload.questionIndex] = action.payload.optionIndex;
      return {
        ...state,
        answers,
      };
    }
 
    case 'GO_TO_QUESTION': {
      let index = action.payload;
      index = Math.min(index, state.qa.length - 1);
      index = Math.max(index, 0);
      return {
        ...state,
        currentIndex: index,
      };
    }
    default:
      return state;
  }
}

export const goToChallengeSection = index => ({
  type: 'GO_TO_CHALLENGE_SECTION',
  payload: index,
});

export const updateChallengeRequest = requestData => ({
  type: 'UPDATE_CHALLENGE_REQUEST',
  payload: requestData,
});

export const setAnswers = answers => ({
  type: 'SET_ANSWERS',
  payload: answers,
});

export const markOption = option => ({
  type: 'MARK_OPTION',
  payload: option,
});



export const goToQuestion = index => ({
  type: 'GO_TO_QUESTION',
  payload: index,
});

export const loadCarousel = carousel => ({
  type: 'LOAD_NAVIGATOR_CAROUSEL',
  payload: carousel,
});