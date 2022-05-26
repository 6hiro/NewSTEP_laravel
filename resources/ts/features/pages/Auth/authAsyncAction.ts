import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROPS_FORGOT, PROPS_RESET } from "../../types";

export const fetchAsyncGetAccount = createAsyncThunk(
  "auth/account",
  async () => {
      const res = await axios.get('/api/user');
      return res.data;
  }
);
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/patch",
  async (user: {nick_name: string, id:  string}) =>{
    const res = await axios.patch(`/api/profile/${user.id}`, {nick_name: user.nick_name});
    return res.data;
  }
);
export const fetchAsyncForgotPassword = createAsyncThunk(
  "auth/forgot",
  async (auth: PROPS_FORGOT) => {
    const res = await axios.post("/api/forgot-password/", auth);
    return res.data;
  }
);
export const fetchAsyncResetPassword = createAsyncThunk(
  "auth/reset",
  async (auth: PROPS_RESET) => {
    const res = await axios.post("/api/reset-password/", auth);
    return res.data;
  }
);
export const fetchAsyncUpdateAccountName = createAsyncThunk(
  "auth/patch",
  async (user: {name: string, id:  string}) =>{
    const res = await axios.patch(`/api/user/${user.id}`, {name: user.name});
    return res.data;
  }
);
export const fetchAsyncDeleteAccount = createAsyncThunk(
  "auth/delete", 
  async (id: string) => {
    const  res  = await axios.delete(`/api/user/${id}`);
    return res.data;
});
export const fetchAsyncGetProfrile = createAsyncThunk(
  "auth/profile",
  async (id: string | undefined) => {
    const res = await axios.get(`/api/user/${id}`);
    return res.data;
  }
);
export const fetchAsyncFollowUnFollow = createAsyncThunk(
  "like/post",
  async (userId: string) => {
    // await axios.get(`/sanctum/csrf-cookie`);
    const res = await axios.put(`/api/user/${userId}/follow`,{});
    return res.data;
  }
);
export const fetchAsyncGetFollowings = createAsyncThunk(
  "followings/get",
  async (userId: string) =>{
    const res =  await axios.get(`/api/user/${userId}/followings`);
    return res.data;
  }
);
export const fetchAsyncGetFollowers = createAsyncThunk(
  "followers/get",
  async (userId: string) =>{
    const res =  await axios.get(`/api/user/${userId}/followers`);
    return res.data;
  }
);
export const fetchAsyncGetLikesUser = createAsyncThunk(
  "followers/get",
  async (postId: string) =>{
    const res =  await axios.get(`/api/user/${postId}/likes`);
    return res.data;
  }
);