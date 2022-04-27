export function getAppointmentsForDay(state, day) {

const filteredDays = state.days.filter(dayName => dayName.name === day)[0];

if (state.days.length === 0 || !filteredDays) {
  return [];
}
let filteredApps = [];

for(const id of filteredDays.appointments) {
  const apptObj = state.appointments[id];
  filteredApps.push(apptObj)


}
return filteredApps
}

export function getInterview(state, interview) {

 if (!interview) {
   return null;
 }

 const interviewerData = state.interviewers[interview.interviewer];
 
 return {
   student: interview.student,
   interviewer: interviewerData
 }
}

export function getInterviewersForDay(state, day) {
 
const filteredDays = state.days.filter(dayName => dayName.name === day)[0];

if (state.days.length === 0 || !filteredDays) {
  return [];
}

  const filteredInterviewers = []
  
  const interviewer = filteredDays.interviewers;
  for (const id of interviewer){
    let interviewer = state.interviewers[id];
    filteredInterviewers.push(interviewer);
  }
  
  return filteredInterviewers;
  }

