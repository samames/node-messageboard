import React, { Fragment, useContext, useState } from 'react';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';

const MessageForm = (props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      await Axios.post(`/messages/${props.recipient}`, { title, content });

      setTitle('');
      setContent('');

      appDispatch({
        type: 'flashMessage',
        value: 'Message sent, successfully',
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
      <form className='messagebox' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder='Content'
          onChange={(e) => setContent(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </Fragment>
  );
};

export default MessageForm;
