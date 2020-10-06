import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import StateContext from '../StateContext';
import Loading from './Loading';

const UploadAvatar = () => {
  const appState = useContext(StateContext);
  const [image, setImage] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/users/me');
        setUser(response.data._id);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getUser();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('avatar', image);
      await axios.post('/users/me/avatar', formData);
      const response = await axios.get('/users/me');
      setUser(response.data._id);
      window.location.reload();
    } catch (err) {
      console.error(err.message);
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
      <div className='container login-container'>
        <h1>Upload Avatar</h1>
        {user ? (
          <img
            className='rounded-circle p10'
            alt='avatar'
            src={`users/${user}/avatar`}
          />
        ) : (
          ''
        )}
        <form onSubmit={handleUpload}>
          Select image to upload:
          <input
            type='file'
            onChange={(e) => setImage(e.target.files[0])}
            name='fileToUpload'
          />
          <input type='submit' value='Upload Image' name='submit' />
        </form>
      </div>
    </Fragment>
  );
};

export default UploadAvatar;
