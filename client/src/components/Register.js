import React, { useState, Fragment, useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await Axios.post('/users', { name, email, password });
      if (user.data.token) {
        localStorage.setItem('token', user.data.token);
      }
      appDispatch({
        type: 'flashMessage',
        value: 'Check your email! :)',
        fmType: 'success',
      });
      history.push(`/`);
    } catch (e) {
      console.log(e.message);
    }
  };

  if (appState.loggedIn === true) {
    return <Redirect to='/boards' />;
  }

  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container login-container'>
        <h1>Register</h1>
        <div>
          {appState.loggedIn === true ? (
            ''
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='name'
                onChange={(e) => setName(e.target.value)}></input>
              <input
                type='text'
                placeholder='email'
                onChange={(e) => setEmail(e.target.value)}></input>
              <input
                type='password'
                placeholder='password'
                onChange={(e) => setPassword(e.target.value)}></input>
              <button type='submit'>submit</button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
