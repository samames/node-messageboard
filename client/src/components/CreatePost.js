import React, { useState, useContext, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const CreatePost = (props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      await Axios.post(`/board/${props.match.params.id}/post`, {
        title,
        content,
      });

      setTitle('');
      setContent('');
      appDispatch({
        type: 'flashMessage',
        value: 'you have created a new post, successfully!',
        fmType: 'success',
      });
      history.push(`/boards/${props.match.params.id}`);
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
  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container create-post-container'>
        <h1>Create a post</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='m5'>
              <input
                type='text'
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}></input>
            </div>
            <div className='m5'>
              <textarea
                value={content}
                placeholder='body of your post'
                onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <div className='m5'>
              <button type='submit'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreatePost;
