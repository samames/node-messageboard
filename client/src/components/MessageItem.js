import React, { useState, useContext, useEffect, Fragment } from 'react';
import Axios from 'axios';
import Moment from 'react-moment';
import { Link, Redirect } from 'react-router-dom';
import StateContext from '../StateContext';
import Loading from './Loading';

const Post = (props) => {
  const [message, setMessage] = useState({});
  const [author, setAuthor] = useState({});
  const appState = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(
          `/messages/${props.match.params.slug}`
        );
        setMessage(response.data[0]);
        setAuthor(response.data[0].author);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getMessage();
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
      <div className='container post-grid'>
        <article className='center'>
          <h1>{message.title}</h1> {message.content}
          <p>
            Written by <Link to={`/profile/${author.slug}`}>{author.name}</Link>
            , <Moment format='DD/MM/YYYY h:ma'>{message.createdAt}</Moment>
          </p>
        </article>
        <aside>
          {author.slug ? (
            <img
              alt='avatar'
              className='rounded-circle'
              src={`/users/${author.slug}/avatar`}
            />
          ) : (
            ''
          )}
        </aside>
      </div>
    </Fragment>
  );
};

export default Post;
