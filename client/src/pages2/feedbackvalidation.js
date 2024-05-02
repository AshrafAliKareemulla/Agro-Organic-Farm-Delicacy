const validateFeedback = (name, feedback) => {
    const namePattern = /^[A-Za-z][A-Za-z0-9]*$/;
    // const phonePattern = /^\d{10}$/;
    const feedbackPattern = /^.{5,}$/;
  
    if (!name.match(namePattern)) {
      return 'Invalid Name';
    } 
    else if (!feedback.match(feedbackPattern)) {
      return 'Feedback should be at least 5 characters';
    } else {
      return null; // No error, feedback is valid
    }
  };
  
  export default validateFeedback;
  