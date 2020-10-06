import React, { Fragment, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';

const ForgotPassword = () => {
  const appState = useContext(StateContext);
  const [email, setEmail] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      await Axios.post('/users/forgot', { email });

      setEmail('');
    } catch (err) {
      console.error(err.message);
    }
  };

  if (appState.loggedIn === true) {
    return <Redirect to='/boards' />;
  }

  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container login-container'>
        <h1>Forgot password</h1>
        <form onSubmit={handleForm}>
          <input
            type='text'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
