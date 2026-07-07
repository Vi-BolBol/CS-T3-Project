import React from 'react';
import { getCompanyRoute } from './routes/companyRoutes';

export default function App() {
  const ActivePage = getCompanyRoute(window.location.pathname);

  return <ActivePage />;
}
