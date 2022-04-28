import axios from "axios";
import { useState, useEffect } from "react";

export default function useApplicationData(props) {

const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
});

const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments"),
    axios.get("/api/interviewers")
  ]).then(all => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
      })
}, []);

function updateSpots (state, appointments) {

  //find the current day

  const dayObj = state.days.find(d => d.name === state.day)

  //look at the appointment id's array

  let spots = 0;
  for (const id of dayObj.appointments) {
    const appointment = appointments[id];
    if (!appointment.interview) {
      spots++;
    }
  }

  const day = { ...dayObj, spots };
  const days = state.days.map(d => d.name === state.day ? day : d);
  setState({...state, appointments, days})

  // returns an updated days array

  return days;
};

function bookInterview(id, interview) {

  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  }

  const newState = {
    ...state,
    appointments,
  }
  
  return axios.put(`/api/appointments/${id}`, {interview})
  .then(() => {updateSpots(newState, appointments, id)})
};

function cancelInterview(id) {
  
  const appointment = {
    ...state.appointments[id],
    interview: null,
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

  const newState = {
    ...state,
    appointments,
  }

  return axios.delete(`/api/appointments/${id}`)
  .then(() => {updateSpots(newState, appointments, id)})
}

  return {
  state,
  setDay,
  bookInterview,
  cancelInterview,
  updateSpots,
  };
}