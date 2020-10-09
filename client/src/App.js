import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import { useImmerReducer } from 'use-immer';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Boards from './components/Boards';
import Board from './components/Board';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import UploadAvatar from './components/UploadAvatar';
import Profile from './components/Profile';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Axios from 'axios';
import Search from './components/Search';
import Profiles from './components/Profiles';
import FlashMessages from './components/FlashMessages';
import Splash from './components/Splash';
import Messages from './components/Messages';
import MessageItem from './components/MessageItem';
import Socket from './components/Socket';
import Chat from './components/Chat';
import Followed from './components/Followed';
import Room from './components/Room';
import socketIOClient from 'socket.io-client';
const endpoint = 'http://localhost:5000';

const App = () => {
  if (localStorage.getItem('token')) {
    Axios.defaults.headers.common['Authorization'] =
      'Bearer ' + localStorage.getItem('token');
  }

  const initState = {
    loggedIn: Boolean(localStorage.getItem('token')),
    superUser: Boolean(false),
    username: localStorage.getItem('username'),
    flashMessage: '',
    fmType: '',
    unreadComments: Boolean(false),
    unreadMessages: Boolean(false),
    socket: undefined,
    usersOnline: undefined,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.username = action.value;
        draft.socket = socketIOClient(endpoint);
        return;
      case 'superUserLogin':
        draft.superUser = true;
        return;
      case 'logout':
        draft.loggedIn = false;
        draft.superUser = false;
        localStorage.setItem('token', '');
        return;
      case 'flashMessage':
        draft.flashMessage = action.value;
        draft.fmType = action.fmType;
        return;
      case 'usersOnline':
        draft.usersOnline = action.value;
        return;
      case 'closeFlashMessage':
        draft.flashMessage = '';
        return;
      case 'unreadComments':
        draft.unreadComments = true;
        document.getElementById('notifyBoards').classList.add('notify');
        return;
      case 'unreadMessages':
        draft.unreadMessages = true;
        document.getElementById('notifyMail').classList.add('notify');
        return;
      default:
        return draft;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initState);

  useEffect(() => {
    console.log('getProfile');
    const getProfile = async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await Axios.get(`/users/me`);
          if (response.data.superUser) {
            dispatch({ type: 'superUserLogin' });
          }
          if (response.data.unreadComments === true) {
            dispatch({ type: 'unreadComments' });
          }
          if (response.data.unreadMessages) {
            dispatch({ type: 'unreadMessages' });
          }
          dispatch({ type: 'login', value: response.data.name });
        } catch (e) {
          console.error(e.message);
        }
      } else {
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'closeFlashMessage' });
    }, 5000);
  }, [state.flashMessage]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          {state.loggedIn && state.socket ? <Socket /> : ''}
          {state.flashMessage ? <FlashMessages /> : ''}
          <Header />
          <Switch>
            <Route path='/' exact component={Splash} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/boards' exact component={Boards} />
            <Route path='/boards/:id' exact component={Board} />
            <Route path='/boards/:id/posts/:post_id' component={Post} />
            <Route path='/boards/:id/new-post' component={CreatePost} />
            <Route path='/upload-avatar' component={UploadAvatar} />
            <Route path='/profile' exact component={Profile} />
            <Route path='/profile/update' component={UpdateProfile} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route path='/password-reset/:id' component={ResetPassword} />
            <Route path='/search' component={Search} />
            <Route path='/profile/:id' component={Profiles} />
            <Route path='/messages' exact component={Messages} />
            <Route path='/messages/:slug' component={MessageItem} />
            <Route path='/chat' component={Chat} />
            <Route path='/feed' component={Followed} />
            <Route path='/room/:roomID' component={Room} />
          </Switch>
        </BrowserRouter>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export default App;
