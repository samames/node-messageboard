import React, { useContext } from 'react';
import StateContext from '../StateContext';

const FlashMessages = () => {
  const appState = useContext(StateContext);
  return (
    <div className={`alert alert-${appState.fmType}`}>
      {appState.flashMessage}
    </div>
  );
};

export default FlashMessages;
