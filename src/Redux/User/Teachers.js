const initialState = {
  teachersData: [
    {
      subject: 'Physics',
      teachers: [
        {
          name: 'Ayush Gautam',
          photo: 'http://unsplash.it/500',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Deepak Jha',
          photo: 'http://unsplash.it/501',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Ashutosh Agarwal',
          photo: 'http://unsplash.it/502',
          coachingName: 'Impulse Coaching',
        },
      ],
      selectedTeacher: -1,
    },
    {
      subject: 'Chemistry',
      teachers: [
        {
          name: 'Ayush Gautam',
          photo: 'http://unsplash.it/500',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Deepak Jha',
          photo: 'http://unsplash.it/501',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Ashutosh Agarwal',
          photo: 'http://unsplash.it/502',
          coachingName: 'Impulse Coaching',
        },
      ],
      selectedTeacher: -1,
    },
    {
      subject: 'Mathematics',
      teachers: [
        {
          name: 'Ayush Gautam',
          photo: 'http://unsplash.it/500',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Deepak Jha',
          photo: 'http://unsplash.it/501',
          coachingName: 'Impulse Coaching',
        },
        {
          name: 'Ashutosh Agarwal',
          photo: 'http://unsplash.it/502',
          coachingName: 'Impulse Coaching',
        },
      ],
      selectedTeacher: -1,
    },
  ],
  selectedSubject: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_SUBJECT':
      return {
        ...state,
        selectedSubject: action.payload,
      };
    case 'LOAD_TEACHERS': {
      const {teachersData} = state;
      console.log(teachersData, action.payload);
      teachersData[teachersData.findIndex(sub => sub.subject === action.payload.subject)] = {
        ...action.payload,
        selectedTeacher: -1,
      };
      return {
        ...state,
        teachersData,
      };
    }
    case 'SELECT_TEACHER':
      let teachersData = state.teachersData;
      teachersData[state.selectedSubject].selectedTeacher = action.payload;
      console.log({
        ...state,
        selectedSubject: -1,
        teachersData,
      });
      return {
        ...state,
        selectedSubject: -1,
        teachersData,
      };
    default:
      return state;
  }
}

export const selectSubject = subjectIndex => ({
  type: 'SELECT_SUBJECT',
  payload: subjectIndex,
});

export const selectTeacher = teacherIndex => ({
  type: 'SELECT_TEACHER',
  payload: teacherIndex,
});


export const loadTeachers = data => ({
  type: 'LOAD_TEACHERS',
  payload: data,
});
