import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import dispatchContext from '../DispatchContext';
import { useHistory } from 'react-router-dom';
import StateContext from '../StateContext';
import Loading from './Loading';

const UpdateProfile = (props) => {
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const appDispatch = useContext(dispatchContext);
  const appState = useContext(StateContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        if (localStorage.getItem('token') == null) {
          throw new Error();
        }

        const response = await Axios.get(`/users/me`);
        setAge(response.data.age);
        setEmail(response.data.email);
        setName(response.data.name);
        setLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    getPost();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.patch('/users/me', {
        name,
        email,
        password,
        age,
      });
      appDispatch({ type: 'logout' });
      localStorage.setItem('token', '');
      history.push('/');
    } catch (e) {
      console.log(e.message);
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
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='age'
            value={age}
            onChange={(e) => setAge(e.target.value)}></input>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}></input>
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
          <input
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}></input>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
