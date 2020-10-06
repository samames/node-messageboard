import React, { useContext, useEffect, Fragment, useState } from 'react';
import StateContext from '../StateContext';

const Chat = () => {
  const appState = useContext(StateContext);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    appState.socket.emit('messageRoom', {
      username: appState.username,
      room: 'main',
      message,
    });
    const html = `<div>${appState.username}: ${message}</div>`;
    document
      .getElementById('chat-container')
      .insertAdjacentHTML('beforeend', html);
    setMessage('');
  };

  useEffect(() => {
    appState.socket.emit('join', { username: appState.username, room: 'main' });
    appState.socket.on('message', (message) => {
      const html = `<div>${message}</div>`;
      document
        .getElementById('chat-container')
        .insertAdjacentHTML('beforeend', html);
    });
  }, []);

  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container'>
        <div id='chat-container'></div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}></input>
            <button type='submit'>Submit</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Chat;
