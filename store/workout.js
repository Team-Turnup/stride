import axios from 'axios';
import {ngrok} from '../ngrok'
import {addWorkout} from './workouts'

// const GET_EXERCISE = 'GET_EXERCISE';
const SET_WORKOUT = 'SET_WORKOUT';

export const setWorkout = workout => ({
  type: SET_WORKOUT,
  workout,
});

export const createWorkoutThunk = routineId => async dispatch => {
  try {
    const response = await axios.post(`${ngrok}/api/workouts/`, {routineId});
    const {workout, routine} = response.data
    dispatch(setWorkout(workout));
    const workoutWithRoutine = workout
    workoutWithRoutine.routine = routine
    dispatch(addWorkout(workoutWithRoutine));
  } catch (err) {
    console.error(err);
  }
};

initialState = {};

//should be a GET_WORKOUTS probably
const workoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORKOUT:
      return action.workout;
    default:
      return state;
  }
};
export default workoutReducer;
