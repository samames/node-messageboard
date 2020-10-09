import React, { useState, useContext, Fragment } from 'react';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { Link, useHistory, Redirect } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const history = useHistory();

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('/users/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        appDispatch({
          type: 'login',
          value: response.data.user.name,
          value2: response.data.user.slug,
        });
        appDispatch({
          type: 'flashMessage',
          value: 'you have logged in successfully!',
          fmType: 'success',
        });
        if (response.data.user.superUser) {
          appDispatch({ type: 'superUserLogin' });
        }
        if (response.data.user.unreadComments === true) {
          appDispatch({ type: 'unreadComments' });
          console.log(response.data.user.unreadComments);
        }
        if (response.data.user.unreadMessages) {
          appDispatch({ type: 'unreadMessages' });
        }

        setEmail('');
        setPassword('');
        history.push('/boards');
      }
    } catch (err) {
      appDispatch({
        type: 'flashMessage',
        value: err.message,
        fmType: 'danger',
      });
    }
  };
  if (appState.loggedIn === true) {
    return <Redirect to='/boards' />;
  }
  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container login-container'>
        <h1>Login</h1>
        {appState.loggedIn === true ? (
          <p>You are currently logged in.</p>
        ) : (
          <Fragment>
            <form onSubmit={handleForm}>
              <input
                autoFocus={true}
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}></input>
              <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}></input>
              <button type='submit'>Submit</button>
            </form>
            <span>
              <Link to='/forgot-password'>Forgot password</Link>
            </span>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
