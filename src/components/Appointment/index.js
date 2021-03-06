import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_ON_SAVE = "ERROR-ON-SAVE";
const ERROR_ON_DELETE = "ERROR-ON-DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_ON_SAVE, true));
  }

  function deleteInterview() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_ON_DELETE));
  }

  return (
  <article className="appointment">
    <Header 
    time = {props.time}
    />

  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && (
    <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    cancelInterview={() => transition(CONFIRM)}
    onEdit={() => transition(EDIT)}
    />
)}
  {mode === CREATE && (
   <Form
    interviewers= {props.interviewers}
    onCancel={back}
    onSave={save}
   />
  )}

  {mode === SAVING && (
    <Status 
    message="SAVING"
     />
  )}

  {mode === CONFIRM && (
    <Confirm 
    onCancel={back}
    onConfirm={deleteInterview}
    message="Are you should you want to cancel this appointment?"
    />
  )}

  {mode === EDIT && (
    <Form 
    student={props.interview.student}
    interviewer={props.interview.interviewer.id}
    interviewers={props.interviewers}
    onCancel={back}
    onSave={save}
    />
  )}

  {mode === DELETING && (
    <Status
    message="Canceling Appointment"
    />
  )}

  {mode === ERROR_ON_SAVE && (
    <Error 
     message="Error: Could not save appointment. Please try again."
     onCancel={back}
    />
  )}

{mode === ERROR_ON_DELETE && (
    <Error 
    message="Error: Could not delete appointment. Please try again."
    onCancel={back}
    />
  )}
  </article>
  )
};