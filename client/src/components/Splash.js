import React, { Fragment, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import StateContext from '../StateContext';

const Splash = () => {
  const appState = useContext(StateContext);

  if (appState.loggedIn === true) {
    return <Redirect to='/boards' />;
  }

  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container splash-container'>
        <Link className='btn btn-blue' to='/register'>
          Sign Up!
        </Link>
        <Link className='btn btn-green' to='/login'>
          Log In!
        </Link>
      </div>
    </Fragment>
  );
};

export default Splash;
