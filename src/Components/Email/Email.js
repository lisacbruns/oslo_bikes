import React, {useState, useRef} from 'react'
import emailjs from 'emailjs-com'
import '../BikeApp/bikeApp.css'

export default function Email() {
  
  const SERVICE_ID = "service_9v55d8i";
  const TEMPLATE_ID = "template_hgeygcr";
  const USER_ID = "user_ctYKzpVo2lT7dSGwoPWeY";
  
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, USER_ID)
      .then((result) => {
        console.log(result.text);
        // Deletes content in form when email is sent
        e.target.reset();
      }, (error) => {
        console.log(error.text);
      });
  };

  return (
    <div className='emailForm'>
      <h1 class="heading">Help us find the location of the next station</h1>
      <div class="under-heading">
        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label class="tag-label">Name:</label>
            <input type="text" name="name" placeholder="Name" className="form-control"/>
          </div>
          <div className="form-group">
            <label class="tag-label">E-mail:</label>
            <input type="email" name="email" placeholder="E-mail" className="form-control"/>
          </div>
          <div className="form-group">
            <label class="tag-label">Next Location:</label>
            <input type="text" name="suggestion" placeholder="Next possible location" className="form-control"/>
          </div>
          <div className="form-group">
            <label class="tag-label">Message:</label>
            <textarea name="reason" placeholder="Why there?" className="form-control"/>
          </div>
          <input type="submit" value="Send" className="btn btn-primary"/>
        </form>
      </div>
    </div>
  );
}
