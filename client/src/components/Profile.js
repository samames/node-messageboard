import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import Loading from './Loading';

const Profile = () => {
  const appState = useContext(StateContext);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(`/users/me`);
        setProfile(response.data);
        setIsLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getProfile();
  }, []);
  if (appState.loggedIn === false) {
    return <Redirect to='/' />;
  }
  if (isLoading) {
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
        <article>
          {profile._id ? (
            <img
              alt='avatar'
              className='rounded-circle'
              src={`users/${profile.slug}/avatar`}
            />
          ) : (
            ''
          )}
          <p>
            <Link className='underline' to='/upload-avatar'>
              Upload avatar
            </Link>
            <br />
            Age: {profile.age}
            <br />
            Name: {profile.name}
            <br />
            Email: {profile.email}
            <br />
            <Link className='underline' to='/profile/update'>
              Update profile
            </Link>
          </p>
        </article>
        <aside></aside>
      </div>
    </Fragment>
  );
};

export default Profile;
