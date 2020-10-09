import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const Socket = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  useEffect(() => {
    appState.socket.on('messageFromServer', () => {
      appState.socket.emit('messageToServer', {
        username: appState.username,
      });
    });
    appState.socket.on('userOff', () => {
      appDispatch({
        type: 'flashMessage',
        value: 'User is offline',
        fmType: 'danger',
      });
    });
    appState.socket.on('recieveCall', (id) => {
      appDispatch({
        type: 'flashMessage',
        value: 'Call initiated',
        fmType: 'success',
      });
      history.push(`/room/${id}`);
    });
    appState.socket.on('mailNotification', () => {
      document.getElementById('notifyMail').classList.add('notify');
    });
    appState.socket.on('boardsNotification', () => {
      document.getElementById('notifyBoards').classList.add('notify');
    });
    appState.socket.on('usersOnline', (users) => {
      let userString = 'Users online: ';
      users.forEach((user, i) => {
        if (i < users.length - 1) {
          userString += `${user}, `;
        } else {
          userString += `${user}`;
        }
      });

      appDispatch({ type: 'usersOnline', value: userString });
    });
  }, []);

  return null;
};

export default Socket;
