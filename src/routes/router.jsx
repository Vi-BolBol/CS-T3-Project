import { createBrowserRouter } from "react-router-dom";

const Home = () => {
  return <h1>Home Page</h1>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);