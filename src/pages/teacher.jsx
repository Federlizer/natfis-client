import React from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from '../components/loading-animation';
import TeacherApp from '../apps/teacher-app';

import { getActiveSession } from '../api/session';
import withRouter from '../utils/withRouter';

(async function IIFE() {
  const rootNode = document.getElementById('root');

  ReactDOM.render(<LoadingAnimation />, rootNode);

  let authenticated = null;
  try {
    authenticated = await getActiveSession();
  } catch (err) {
    console.error(err);
  }

  if (!authenticated) {
    window.location.pathname = '/landing';
    return;
  }

  const TeacherAppWithRouter = withRouter(TeacherApp, '/teacher');

  ReactDOM.render(<TeacherAppWithRouter />, rootNode);
}());
