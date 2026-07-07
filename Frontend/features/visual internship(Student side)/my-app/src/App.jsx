import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export default function App() {
  return (
    <div className="antialiased selection:bg-[#10b981]/30 selection:text-[#10b981]">
      <RouterProvider router={router} />
    </div>
  );
}