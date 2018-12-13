const initialState = {
  section: 0,
  qa: [],
  selectedSubject: 'p',
  selectedGoal: 'CBSE',
  selectedTime: 12,
  selectedTopics: [],
  currentIndex: 0,
  navigatorCarousel: null,
  testCompleted: false,
  reviewMode: false,
  answers: [],
  gymMode: false,
  correctAnswers: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_NAVIGATOR_CAROUSEL':
      return {
        ...state,
        navigatorCarousel: action.payload,
      };
    case 'LOAD_TEST_QUESTIONS':
      return {
        ...state,
        currentIndex: 0,
        qa: action.payload,
        answers: [],
      };
    case 'LOAD_TEST_ANSWERS':
      return {
        ...state,
        correctAnswers: action.payload,
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentIndex: state.currentIndex === 0 ? 0 : state.currentIndex - 1,
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: state.currentIndex === state.qa.length - 1 ? state.qa.length - 1 : state.currentIndex + 1,
      };
    case 'NEXT_TEST_SECTION':
      return {
        ...state,
        section: state.section + 1,
        reviewMode: false,
      };
    case 'PREV_TEST_SECTION':
      return {
        ...state,
        section: state.section - 1,
        reviewMode: false,
      };
    case 'GO_TO_TEST_SECTION':
      return {
        ...state,
        section: action.payload,
        reviewMode: false,
      };
    case 'GO_TO_QUESTION':
      let index = action.payload;
      index = Math.min(index, state.qa.length - 1);
      index = Math.max(index, 0);
      return {
        ...state,
        currentIndex: index,
      };
    case 'ENTER_REVIEW_MODE':
      return {
        ...state,
        reviewMode: true,
        section: 2,
        currentIndex: 0,
      };
    case 'EXIT_REVIEW_MODE':
      return {
        ...state,
        reviewMode: false,
      };
    case 'SET_ANSWERS':
      return {
        ...state,
        ...action.payload,
      };
    case 'MARK_OPTION':
      let answers = state.answers;
      answers[action.payload.questionIndex] = action.payload.optionIndex;
      return {
        ...state,
        answers,
      };
    case 'SELECT_TEST_SUBJECT': {
      console.log(action.payload);
      return {
        ...state,
        selectedSubject: action.payload,
        gymMode: false,
      };
    }
    case 'SELECT_TEST_GOAL': {
      return {
        ...state,
        selectedGoal: action.payload,
      };
    }
    case 'SELECT_TEST_TIME': {
      return {
        ...state,
        selectedTime: action.payload,
      };
    }
    case 'SELECT_TEST_TOPICS': {
      return {
        ...state,
        selectedTopics: action.payload,
      };
    }
    case 'ENTER_GYM_MODE': {
      return {
        ...state,
        gymMode: true,
      };
    }
    default:
      return state;
  }
}

export const nextTestSection = () => ({
  type: 'NEXT_TEST_SECTION',
});

export const prevTestSection = () => ({
  type: 'PREV_TEST_SECTION',
});

export const goToTestSection = index => ({
  type: 'GO_TO_TEST_SECTION',
  payload: index,
});

export const nextQuestion = () => ({
  type: 'NEXT_QUESTION',
});

export const prevQuestion = () => ({
  type: 'PREV_QUESTION',
});

export const goToQuestion = index => ({
  type: 'GO_TO_QUESTION',
  payload: index,
});

export const loadCarousel = carousel => ({
  type: 'LOAD_NAVIGATOR_CAROUSEL',
  payload: carousel,
});

export const enterReviewMode = () => ({
  type: 'ENTER_REVIEW_MODE'
});

export const exitReviewMode = () => ({
  type: 'EXIT_REVIEW_MODE'
});

export const setAnswers = answers => ({
  type: 'SET_ANSWERS',
  payload: answers,
});

export const markOption = option => ({
  type: 'MARK_OPTION',
  payload: option,
});

export const loadTestQuestions = qa => ({
  type: 'LOAD_TEST_QUESTIONS',
  payload: qa,
});

export const loadTestAnswers = ans => ({
  type: 'LOAD_TEST_ANSWERS',
  payload: ans,
});

export const selectTestSubject = subject => ({
  type: 'SELECT_TEST_SUBJECT',
  payload: subject,
});

export const selectGoal = goal => ({
  type: 'SELECT_TEST_GOAL',
  payload: goal,
});

export const selectTopics = topics => ({
  type: 'SELECT_TEST_TOPICS',
  payload: topics,
});

export const selectTime = time => ({
  type: 'SELECT_TEST_TIME',
  payload: time,
});

export const gymMode = time => ({
  type: 'ENTER_GYM_MODE',
});



