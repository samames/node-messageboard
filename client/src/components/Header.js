import React, { useContext, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import axios from 'axios';

const Header = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const handleLogout = () => {
    appDispatch({ type: 'logout' });
    appState.socket.disconnect();
    history.push('/');
  };

  const handleBoards = async () => {
    document.getElementById('notifyBoards').classList.remove('notify');
    await axios.patch('/comments');
  };
  const handleMail = async () => {
    document.getElementById('notifyMail').classList.remove('notify');
    await axios.patch('/messages');
  };

  return (
    <div className='nav'>
      <Link to='/boards'>
        <span>Sam's board</span>
      </Link>
      <nav>
        {appState.loggedIn === true ? (
          <Fragment>
            <ul>
              <li>
                <button
                  className='btn-link'
                  type='button'
                  onClick={handleLogout}>
                  Logout
                </button>
              </li>{' '}
              <li id='notifyBoards' onClick={handleBoards}>
                <Link to='/boards'>Boards</Link>
              </li>{' '}
              <li>
                <Link to='/chat'>Chat</Link>
              </li>{' '}
              <li>
                <Link to='/profile'>Profile</Link>
              </li>{' '}
              <li>
                <Link to='/search'>Search</Link>
              </li>{' '}
              <li id='notifyMail' onClick={handleMail}>
                <Link to='/messages'>Messages</Link>
              </li>{' '}
              <li>
                <Link to='/feed'>Feed</Link>
              </li>
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            <ul>
              <li>
                <Link to='/login'>Login</Link>
              </li>{' '}
              <li>
                <Link to='/register'>Register</Link>
              </li>
            </ul>
          </Fragment>
        )}
      </nav>
    </div>
  );
};

export default Header;
