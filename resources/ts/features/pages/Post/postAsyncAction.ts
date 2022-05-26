import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROPS_COMMENT } from "../../types";

export const fetchAsyncDeletePost = createAsyncThunk(
    "post/delete", 
    async (id: string ) => {
      const  res  = await axios.delete(`/api/post/${id}`);
      return res.data;
});
export const fetchAsyncGetMorePosts = createAsyncThunk(
    "morePosts/get", 
    async (link: string) => {
      const res = await axios.get(link);
      return res.data;
    }
);
export const fetchAsyncGetPost = createAsyncThunk(
    "postDetail/get", 
    async (id: string | undefined) => {
        const res = await axios.get(`/api/post/${id}`)
        return res.data;
    }
);
export const fetchAsyncGetUserPosts = createAsyncThunk(
    "userPosts/get", 
    async (userId: string | undefined) => {
        const res = await axios.get(`/api/post/user/${userId}`);
        return res.data;
    }
);
export const fetchAsyncGetSearchedPosts = createAsyncThunk(
    "searchedPosts/get", 
    async (word: string | undefined) => {
        const res = await axios.get(`/api/post/search/${word}`)
        return res.data;
    }
);
export const fetchAsyncGetSearchedPostsLatest = createAsyncThunk(
    "searchedPostsLatest/get", 
    async (word: string | undefined) => {
        const res = await axios.get(`/api/post/search/${word}/latest`)
        return res.data;
    }
);
export const fetchAsyncGetHashtagPosts = createAsyncThunk(
    "hashtagPosts/get", 
    async (hashtagId: string | undefined) => {
        const res = await axios.get(`/api/post/hashtag/${hashtagId}`)
        return res.data;
    }
);
export const fetchAsyncGetHashtagLatestPosts = createAsyncThunk(
    "hashtagLatestPosts/get", 
    async (hashtagId: string | undefined) => {
        const res = await axios.get(`/api/post/hashtag/${hashtagId}/latest`)
        return res.data;
    }
);
export const fetchAsyncGetFollowingsPosts = createAsyncThunk(
    "followingsPosts/get",
    async () => {
        const res = await axios.get(`/api/followings/post`);
        return res.data;
    }
);
export const fetchAsyncGetLikedPosts = createAsyncThunk(
    "LikedPosts/get",
    async (userId: string | undefined) => {
        const res = await axios.get(`/api/post/user/${userId}/like`);
        return res.data;
    }
);
export const fetchAsyncLikeUnlikePost = createAsyncThunk(
    "like/patch",
    async (postId: string) => {
        // await axios.get(`/sanctum/csrf-cookie`);
        const res = await axios.put(`/api/post-like/${postId}`,{});
        return res.data;
    }
);
export const fetchAsyncPostComment = createAsyncThunk(
"comment/post",
    async (comment: PROPS_COMMENT) => {
        const res = await axios.post(`/api/post/comment`, comment);
        return res.data;
    }
);
export const fetchAsyncDeleteComment = createAsyncThunk(
    "commentDelete/delete", 
    async (id: string) => {
        const  res  = await axios.delete(`/api/post/comment/${id}`);
        return res.data;
    }
);
export const fetchAsyncSharePost = createAsyncThunk(
    "share/post",
    async (postId: string) => {
    //   uploadData.append("isPublic", newPost.isPublic);
        const res = await axios.post(`/api/post-share/${postId}`, {});
        return res.data;
    }
);
export const fetchAsyncUnsharePost = createAsyncThunk(
    "unshare/post",
    async (postId: string) => {
    //   uploadData.append("isPublic", newPost.isPublic);
        const res = await axios.post(`/api/post-unshare/${postId}`, {});
        return res.data;
    }
);