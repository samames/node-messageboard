import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import Moment from 'react-moment';
import { Link, Redirect } from 'react-router-dom';
import StateContext from '../StateContext';
import Loading from './Loading';

const Board = (props) => {
  const [messages, setMessages] = useState([]);
  const appState = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(`/my/messages`);
        setMessages(response.data);
        setLoading(false);
      } catch (e) {}
    };
    getMessages();
  }, []);
  if (appState.loggedIn === false) {
    return <Redirect to='/' />;
  }
  if (loading) {
    return (
      <Fragment>
        <div className='container'>
          <Loading />
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container board-grid'>
        {messages[0] ? (
          messages.map((message) => {
            return (
              <Fragment key={message._id}>
                <div>
                  <Link className='underline' to={`/messages/${message.slug}`}>
                    <strong>{message.title}</strong>
                  </Link>
                </div>
                <div>
                  Authored by:{' '}
                  <Link
                    className='underline'
                    to={`/profile/${message.author.slug}`}>
                    {message.author.name}
                  </Link>
                </div>
                <div>
                  <Moment format='DD/MM/YYYY h:mma'>{message.createdAt}</Moment>
                </div>
              </Fragment>
            );
          })
        ) : (
          <p>No messages yet...</p>
        )}
      </div>
    </Fragment>
  );
};

export default Board;
