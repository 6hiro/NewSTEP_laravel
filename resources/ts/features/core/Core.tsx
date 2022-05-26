import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "../components/layout/Layout";
import ScrollToTop from "./ScrollToTop ";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import AddRoadmapForm from "../pages/Roadmap/AddRoadmapForm";
import RoadmapSearch from "../pages/Search/RoadmapSearch";
import FollowingRoadmap from "../pages/Roadmap/FollowingRoadmap";
import Steps from "../pages/Roadmap/Steps";
import Settings from "../pages/Auth/Settings";
import Profiles from "../components/profile/Profiles";
import Profile from "../pages/Profile/Profile"
import Search from "../pages/Search/Search";
import AddPostForm from "../pages/Post/AddPostForm";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import PostDetail from "../pages/post/PostDetail";
import PostHashtag from "../pages/post/PostHashtag";
import PostSearch from "../pages/Search/PostSearch";


const Core: React.FC = () => {
  
  return (
    <>
      <BrowserRouter>
        {/* ページ遷移時にスクロール位置をトップに */}
        <ScrollToTop />

        {/* いいねした人やfollower、followeeの一覧 */}
        <Profiles />

        <Routes>
          <Route path="/" element={<Layout />}>
              {/* Auth */}
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />}/>
              <Route path="/auth/reset-password" element={<ResetPassword />}/>
              {/* Search */}
              <Route path="/search" element={<Search />} />
              <Route path="/search/post/" element={<PostSearch />} />
              <Route path="/search/roadmap/" element={<RoadmapSearch />} /> 
              {/* Profile */}
              <Route path="/prof/:id" element={<Profile />} />
              {/* Roadmap */}
              <Route path="/roadmap/add" element={<AddRoadmapForm />} />
              <Route path="/following/roadmap" element={<FollowingRoadmap />} /> 
              <Route path="/step/roadmap/:id" element={<Steps />} />
              {/* Post */}
              <Route index element={<Home />} />
              <Route path="/post/add" element={<AddPostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/hashtag/:name" element={<PostHashtag />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Core;