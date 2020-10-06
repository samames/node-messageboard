import React, { useState, useContext, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const ResetPassword = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      await Axios.put(`/users/password-reset/${props.match.params.id}`, {
        password,
      });
      appDispatch({
        type: 'flashMessage',
        value: 'Check your email! :)',
        fmType: 'success',
      });
      setPassword('');
    } catch (err) {
      appDispatch({
        type: 'flashMessage',
        value: err.message,
        fmType: 'danger',
      });
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
        <form onSubmit={handleForm}>
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </Fragment>
  );
};

export default ResetPassword;
