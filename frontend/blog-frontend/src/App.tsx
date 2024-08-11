import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import RootLayout from "./Layouts/RootLayout";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Blogs />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
