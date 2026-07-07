import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Setting from '../pages/Setting';
import Application from '../pages/Application';
import CVChoice from '../pages/CVChoice';
import CVMaker from '../pages/CVMaker';
import CVPreview from '../pages/CVPreview';
import Pipeline from '../pages/Pipeline';
import ViewDetail from '../pages/ViewDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/settings',
    element: <Setting />,
  },
  {
    path: '/applications',
    element: <Application />,
  },
  {
    path: '/cv-choice',
    element: <CVChoice />,
  },
  {
    path: '/cv-maker',
    element: <CVMaker />,
  },
  {
    path: '/cv-preview',
    element: <CVPreview />,
  },
  {
    path: '/pipeline',
    element: <Pipeline />,
  },
  {
    path: '/view-detail',
    element: <ViewDetail />,
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);