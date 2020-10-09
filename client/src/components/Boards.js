import React, {
  useEffect,
  useState,
  useContext,
  Fragment,
  useRef,
} from 'react';
import Axios from 'axios';
import StateContext from '../StateContext';
import { Link, Redirect } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import Moment from 'react-moment';
import Loading from './Loading';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const appState = useContext(StateContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);

  const getBoards = async (cancelToken) => {
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      const response = await Axios.get('/boards', {
        cancelToken: cancelToken.token,
      });
      setBoards(response.data);
      setIsLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    const request = Axios.CancelToken.source();
    getBoards(request);

    return () => {
      request.cancel();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      await Axios.post(`/boards`, { title, description });
      appDispatch({
        type: 'flashMessage',
        value: 'you have created a board successfully!',
        fmType: 'success',
      });
      setIsLoading(true);
      setTitle('');
      setDescription('');
      const request = Axios.CancelToken.source();
      getBoards(request);
      return () => {
        request.cancel();
      };
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
      <div className='container boards-container'>
        {boards.map((board) => {
          if (board !== null) {
            return (
              <Fragment key={board._id}>
                <div>
                  <i className='fas fa-folder-open fa-3x'></i>
                </div>
                <div key={board._id}>
                  <Link to={`/boards/${board.slug}`}>
                    <strong>{board.title}</strong>
                  </Link>
                  <br />
                  {board.description}
                </div>
                <div className='boards-center'>
                  {board.numOfPosts ? board.numOfPosts : '0'}
                </div>
                <div>
                  <strong>
                    <Link
                      to={`/boards/${board.slug}/posts/${board.latestSlug}`}>
                      {board.latestTitle}
                    </Link>
                  </strong>
                  <br />
                  By{' '}
                  <Link to={`/profile/${board.latestAuthorId}`}>
                    {board.latestAuthor}
                  </Link>
                  <br />
                  <Moment format='DD/MM/YYYY h:mma'>{board.latestDate}</Moment>
                </div>
                <div className='container'>{appState.usersOnline}</div>
              </Fragment>
            );
          } else {
            return null;
          }
        })}

        {appState.superUser === false ? (
          ''
        ) : (
          <Fragment>
            <div></div>
            <div className='add-board'>
              Create new board
              <br />
              <form onSubmit={handleSubmit}>
                <input
                  type='text'
                  placeholder='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}></input>
                <input
                  type='text'
                  placeholder='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}></input>
                <button type='submit'>Submit</button>
              </form>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Boards;
