import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-w-[350px]">
      {/* Toast Container */}
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <h1>Home</h1>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
