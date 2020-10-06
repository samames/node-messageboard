import React, { Fragment, useState, useContext } from 'react';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';

const CommentForm = (props) => {
  const [comment, setComment] = useState('');
  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      await Axios.post(`/posts/${props.postId}/comment`, { comment });
      setComment('');
      props.cb();
      appDispatch({
        type: 'flashMessage',
        value: 'Comment Successfully created',
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

  return (
    <Fragment>
      <h3>Create a comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className='width-250'
          value={comment}
          placeholder='body of your post'
          onChange={(e) => setComment(e.target.value)}></textarea>
        <br />
        <button type='submit'>Submit</button>
      </form>
    </Fragment>
  );
};

export default CommentForm;
