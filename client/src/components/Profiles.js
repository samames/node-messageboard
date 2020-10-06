import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import Loading from './Loading';
import MessageForm from './MessageForm';
import DispatchContext from '../DispatchContext';
import { v1 as uuid } from 'uuid';

const Profiles = (props) => {
  const [profile, setProfile] = useState({});
  const [id, setId] = useState(props.match.params.id);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(`/users/${id}`);

        setProfile(response.data.userProfile);
        setFollowed(response.data.followed);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getProfile();
  }, []);

  const handleFollow = async () => {
    try {
      const response = await Axios.post(`/users/follow`, {
        follow: profile._id,
      });
      setFollowed(true);
      if (response) {
        appDispatch({
          type: 'flashMessage',
          value: `you have successfully followed ${profile.name}!`,
          fmType: 'success',
        });
      }
    } catch (err) {
      appDispatch({
        type: 'flashMessage',
        value: `${err.message}`,
        fmType: 'danger',
      });
    }
  };

  const handleRemoveFollow = async () => {
    try {
      const response = await Axios.patch(`/users/unfollow`, {
        unfollow: profile._id,
      });
      setFollowed(false);
      if (response) {
        appDispatch({
          type: 'flashMessage',
          value: `you have successfully unfollowed ${profile.name}!`,
          fmType: 'success',
        });
      }
    } catch (err) {
      appDispatch({
        type: 'flashMessage',
        value: `${err.message}`,
        fmType: 'danger',
      });
    }
  };

  const displayFollow = () => {
    if (profile.name === appState.username) {
      return '';
    }
    if (!followed) {
      return (
        <button className='btn-link' type='button' onClick={handleFollow}>
          Follow
        </button>
      );
    }
    if (followed) {
      return (
        <button className='btn-link' type='button' onClick={handleRemoveFollow}>
          Unfollow
        </button>
      );
    }
  };

  const call = () => {
    const id = uuid();
    appState.socket.emit('call', { username: profile.name, id });
    history.push(`/room/${id}`);
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
      <div className='container profile-grid'>
        <article>
          {id ? (
            <img
              alt='avatar'
              className='rounded-circle'
              src={`http://localhost:3000/users/${id}/avatar`}
            />
          ) : (
            ''
          )}
          <p>
            Age: {profile.age}
            <br />
            Name: {profile.name}
            <br />
            Email: {profile.email}
            <br />
            {displayFollow()}
            <br />
            <button type='button' className='btn-link' onClick={call}>
              Call
            </button>
          </p>
        </article>
        <aside>
          <h1 className='mb10'>Message User</h1>
          <MessageForm recipient={profile.slug} />
        </aside>
      </div>
    </Fragment>
  );
};

export default Profiles;
