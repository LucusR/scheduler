import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";

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


function getDayId (day) {
  const daysData = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    }
    return daysData[day]
}


function bookInterview(id, interview) {

  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  }

  const currentDay = getDayId(state.day)

  const day = {
    ...state.days[currentDay],
    spots: state.days[currentDay].spots - 1
  }

  let days = state.days
  days[currentDay] = day;
  
  return axios.put(`/api/appointments/${id}`, {interview})
  .then(() => {setState({...state, appointments, days})});
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

  const currentDay = getDayId(state.day)

  const day = {
    ...state.days[currentDay],
    spots: state.days[currentDay].spots + 1
  }

  let days = state.days
  days[currentDay] = day;

  
  return axios.delete(`/api/appointments/${id}`,)
  .then(() => {setState({...state, appointments, days})})
}

  return {
  state,
  setDay,
  bookInterview,
  cancelInterview,
  };
}