
import {Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home";
import BlogPage from "./Components/Blog/BlogPage";
import Profile from "./Components/Auth/Profile";
import EditBlog from "./Components/Blog/EditBlog";
import CreateBlog from "./Components/Blog/CreateBlog";
import CreateCategory from "./Components/Category/CreateCategory";
import ByCategory from "./Components/Category/ByCategory";
import Gallery from "./Components/Layout/Gallery";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SingUp";
import Compiler from "./Components/Compiler/Compiler";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/blog/:id" element={<BlogPage />} /> 
      <Route path="/profile" element={<Profile />} />
      <Route path="/blog/edit/:id" element={<EditBlog />} /> 
      <Route path="/blog/create" element={<CreateBlog />} /> 
      <Route path="/category" element={<CreateCategory />} /> 
      <Route path="/category/:id" element={<ByCategory />} /> 
      <Route path="/gallery" element={<Gallery />} /> 
      <Route path="/compiler" element={<Compiler />} /> 

      </Route>
    </Routes>
  );
}

export default App;
