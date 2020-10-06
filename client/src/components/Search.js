import React, { Fragment, useContext, useState } from 'react';
import Axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import StateContext from '../StateContext';

const Search = () => {
  const appState = useContext(StateContext);
  const [searchTerm, setSearchTerm] = useState('');

  const [searchResultPosts, setSearchResultPosts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem('token') == null) {
        throw new Error();
      }

      const response = await Axios.post(`/search`, { searchTerm });

      setSearchResultPosts(response.data.posts);
      setSearchTerm('');
    } catch (err) {
      console.log(err.message);
    }
  };
  if (appState.loggedIn === false) {
    return <Redirect to='/' />;
  }
  return (
    <Fragment>
      <div className='bg'></div>
      <div className='container search-container'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            autoFocus={true}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          {'   '}
          <button type='submit' className='btn btn-search'>
            Search
          </button>
        </form>

        {searchResultPosts.map((post) => {
          return (
            <Fragment key={post._id}>
              <div className='search-grid'>
                <div>
                  <Link to={`/boards/${post.board}/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </div>
                <div>
                  Authored by{' '}
                  <Link to={`/profile/${post.author._id}`}>
                    {post.author.name}
                  </Link>
                </div>
                <div>
                  <Moment format='DD/MM/YYYY h:mma'>{post.createdAt}</Moment>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </Fragment>
  );
};

export default Search;
