import React, { useState } from 'react';
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form (props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  //function to reset form
  const reset = function () {
    setStudent("");
    setInterviewer(null);
  }

  const cancel = function () {
    reset();
    props.onCancel();
  }

  // function to validate form submission inputs
  function validate() {
    
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    } else if (interviewer === null) {
      setError("Please select an interviewer");
    return;
    } else {
      setError("");
      return props.onSave(student, interviewer);
    }
  }

  return (

<main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form autoComplete="off" onSubmit={event => event.preventDefault()}>
      <input
        className="appointment__create-input text--semi-bold"
        name='name'
        value={student}
        type="text"
        placeholder="Enter Student Name"
        onChange={(e) => setStudent(e.target.value)}
        data-testid="student-name-input"
      />
      <section className="appointment__validation">{error}</section>
    </form>
    <InterviewerList
     interviewers={props.interviewers}
     value={interviewer}
     onChange={(e) => {setInterviewer(e)}}
     />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button danger onClick={cancel}>Cancel</Button>
      <Button confirm onClick={() => validate(student, interviewer)}>Save</Button>
    </section>
  </section>
</main>
  )
};