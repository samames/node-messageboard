import React, { useState, useContext, useEffect, Fragment } from 'react';
import Axios from 'axios';
import Moment from 'react-moment';
import { Link, Redirect } from 'react-router-dom';
import CommentForm from './CommentForm';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import Loading from './Loading';

const Post = (props) => {
  const [post, setPost] = useState({});
  const [author, setAuthor] = useState({});
  const [board, setBoard] = useState('');
  const [comments, setComments] = useState([]);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(
          `/posts/${props.match.params.post_id}`
        );
        setPost(response.data);
        setAuthor(response.data.author);
        setBoard(response.data.board);
        setComments(response.data.comments);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getPost();
  }, []);

  const getPost = async () => {
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      const response = await Axios.get(`/posts/${props.match.params.post_id}`);
      setPost(response.data);
      setAuthor(response.data.author);
      setBoard(response.data.board);
      setComments(response.data.comments);
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  };
  const deleteComment = async (e, id) => {
    e.preventDefault();

    try {
      await Axios.delete(`/posts/${props.match.params.post_id}/${id}`);
      getPost();
      appDispatch({
        type: 'flashMessage',
        value: 'comment deleted.',
        fmType: 'success',
      });
    } catch (err) {
      appDispatch({
        type: 'flashMessage',
        value: err.message,
        fmType: 'danger',
      });
    }
  };
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
          <h1>{post.title}</h1> {post.content}
          <p>
            Written by {author ? (<Link to={`/profile/${author.name}`}>{author.name}</Link>) : 'Deleted user'}
            , <Moment format='DD/MM/YYYY h:mma'>{post.createdAt}</Moment>
          </p>
        </article>
        <aside>
          {author ? (
            <img
              alt='avatar'
              className='rounded-circle'
              src={`/users/${author.name}/avatar`}
            />
          ) : (
            ''
          )}
          {comments.map((comment) => {
            if (comment.user !== null) {
              return (
                <div key={comment._id}>
                  {comment.comment} -{' '}
                  <Link to={`/profile/${comment.user.slug}`}>
                    {comment.user.name}
                  </Link>{' '}
                  {appState.username === comment.user.name && (
                    <form onSubmit={(e) => deleteComment(e, comment._id)}>
                      <button type='submit'>Delete</button>
                    </form>
                  )}
                </div>
              );
            } else {
              return (
                <div key={comment._id}>{comment.comment} - Deleted User</div>
              );
            }
          })}
          <br />

          <CommentForm postId={post.slug} cb={getPost} />
          <p>
            <Link to={`/boards/${board}`}>Back to board</Link>
          </p>
        </aside>
      </div>
    </Fragment>
  );
};

export default Post;
