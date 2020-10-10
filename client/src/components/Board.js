import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import Moment from 'react-moment';
import { Link, Redirect } from 'react-router-dom';
import StateContext from '../StateContext';
import Loading from './Loading';

const Board = (props) => {
  const [board, setBoard] = useState([]);
  const appState = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBoard = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(
          `/board/${props.match.params.id}/posts`
        );
        setBoard(response.data);
        setLoading(false);
      } catch (e) {}
    };
    getBoard();
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
        {board.map((post) => {
          return (
            <Fragment key={post._id}>
              <div>
                <Link
                  className='underline'
                  to={`/boards/${post.board}/posts/${post.slug}`}>
                  <strong>{post.title}</strong>
                </Link>
              </div>
              <div>
                Authored by:{' '}
                {post.author ? (<Link className='underline' to={`/profile/${post.author.slug}`}>
                  {post.author.name}
                </Link>) : 'Deleted user'}
              </div>
              <div>
                <Moment format='DD/MM/YYYY h:mma'>{post.createdAt}</Moment>
              </div>
            </Fragment>
          );
        })}
        <div>
          <Link
            className='underline'
            to={`/boards/${props.match.params.id}/new-post`}>
            Create new post
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Board;
