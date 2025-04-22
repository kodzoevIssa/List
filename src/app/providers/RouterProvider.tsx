import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PostList } from "../../pages/PostList";
import { PostDetail } from "../../pages/PostDetail";

export const RouterProvider = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  </Router>
);
