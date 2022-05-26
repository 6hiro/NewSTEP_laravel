import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import {
  fetchAsyncGetPost,
  fetchAsyncGetMorePosts,
  fetchAsyncGetUserPosts,
  fetchAsyncGetSearchedPosts,
  fetchAsyncGetSearchedPostsLatest,
  fetchAsyncGetHashtagPosts,
  fetchAsyncGetHashtagLatestPosts,
  fetchAsyncGetFollowingsPosts,
  fetchAsyncGetLikedPosts,
  fetchAsyncLikeUnlikePost,
  fetchAsyncPostComment,
} from "./postAsyncAction";


export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openPost: false,
    postPath: "",
    currentPageLink: "",
    selectOpenDeleteCommentForm: false,
    selectedComment:{
      id: "",
      content: "",
    },
    nextPageLink: "",
    posts: [
      {
        id: "",
        content: "",
        user: {id: "", name: "", nick_name: ""},
        img: "",
        created_at: "",
        since: "",
        is_public: true,
        is_liked: false,
        count_likes: 0,
        is_shared: false,
        count_comments: 0,
        tags: [{
            id: "",
            name: "",
        }],
        parent: {
          id: "",
          content: "",
          user: {id: "", name: "", nick_name: ""},
          img: "",
          created_at: "",
          since: "",
          is_public: true,
          is_liked: false,
          count_likes: 0,
          is_shared: false,
          count_comments: 0,
          tags: [{
              id: "",
              name: "",
          }],
        },
      },
    ],
    post: 
    {
        id: "",
        content: "",
        user: {id: "", name: "", nick_name: ""},
        img: "",
        created_at: "",
        since: "",
        is_public: true,
        is_liked: false,
        count_likes: 0,
        is_shared: false,
        count_comments: 0,
        tags: [{
            id: "",
            name: "",
        }],
        parent: {
          id: "",
          content: "",
          user: {id: "", name: "", nick_name: ""},
          img: "",
          created_at: "",
          is_public: true,
          is_liked: false,
          count_likes: 0,
          is_shared: false,
          count_comments: 0,
          tags: [{
              id: "",
              name: "",
          }],
        }
        
    },
    comments: [
      {
        id: "",
        content: "",
        user: {id: "", name: "", nick_name: ""},
        img: "",
        created_at: "",
      },
    ],
  },
  reducers: {
    fetchSelectedComment(state, action){
      state.selectedComment=action.payload
    },
    setOpenDeleteCommentForm(state) {
      state.selectOpenDeleteCommentForm = true;
    },
    resetOpenDeleteCommentForm(state) {
      state.selectOpenDeleteCommentForm = false;
    },
    setOpenPost(state) {
      state.openPost = true;
    },
    resetOpenPost(state) {
      state.openPost = false;
    },
    resetNextPageLink(state) {
      state.nextPageLink = ""
    },
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    fetchCommentDelete(state, action){
      state.post.count_comments -= 1;
      state.comments = state.comments.filter((comment)=> comment.id !== action.payload)
    },
    fetchUpdateProf(state, action){
      // Profを編集したときに投稿の投稿者名を変更する処理
      state.posts.map((post) => {
        post.user.nick_name = 
        post.user.id === action.payload.postedBy 
          ? action.payload.nick_name 
          : post.user.nick_name
        
        if(post.is_shared === true){
          post.parent.user.nick_name = action.payload.nick_name 

          post.parent.user.nick_name = 
          post.parent.user.id === action.payload.postedBy 
            ? action.payload.nick_name 
            : post.parent.user.nick_name
        }
      
      });
    },
    fetchPostShare(state, action){
      // console.log(action.payload)
      const unshare = (post:any) => {
        post.is_shared = false;
        return post;
      }
      state.posts.map((post) =>
        // post.id === action.payload ? unshare(post) : post,
        post.is_shared=
          post.id === action.payload ? true : post.is_shared,
      );
    },
    fetchPostUnshare(state, action){
      // state.posts.map((post) =>
      //   post.is_shared=
      //     post.id === action.payload ? false : post.is_shared,
      // );
      state.posts = state.posts.filter((post)=> post.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMorePosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: [...state.posts, ...action.payload.data],
      };
    });
    builder.addCase(fetchAsyncGetPost.fulfilled, (state, action) => {
      return {
        ...state,
        post: action.payload.post,
        comments: action.payload.post.comments
      };
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetSearchedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: "",
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetSearchedPostsLatest.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetHashtagPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: "",
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetHashtagLatestPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetFollowingsPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncGetLikedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next_page_link,
        posts: action.payload.data,
      };
    });
    builder.addCase(fetchAsyncLikeUnlikePost.fulfilled, (state, action) => {
      if(action.payload.result==='like'){
        // postのstateの変更
        state.post.count_likes += 1
        state.post.is_liked = true
        // postsのstateの変更   
        state.posts = state.posts.map((post) =>
          {
            if(post.is_shared){
              if(post.parent.id === action.payload.id){
                post.parent.count_likes += 1
                post.parent.is_liked = true;
              }  
            }
            else{
              if(post.id === action.payload.id){
                post.count_likes += 1
                post.is_liked = true;                
              }
            }
            return post
          }
        
        );
      }
      else if(action.payload.result==='unlike'){
        state.post.count_likes -= 1
        state.post.is_liked = false
        // postsのstateの変更
        state.posts = state.posts.map((post) =>
          {
            if(post.is_shared){
              // シェアされたpostのいいねを変更
              if(post.parent.id === action.payload.id){
                post.parent.count_likes -= 1
                post.parent.is_liked = false;
              }  
            }
            else{
              // postのいいねを変更
              if(post.id === action.payload.id){
                post.count_likes -= 1
                post.is_liked = false;                
              }
            }
            return post
          }
        
        );
      }
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      state.post.count_comments= state.post.count_comments+1;
      state.comments =  [ ...state.comments, action.payload.comment];
    });

  },
});

export const {
  setOpenDeleteCommentForm,
  resetOpenDeleteCommentForm,
  fetchSelectedComment,
  fetchPostStart,
  fetchPostEnd,
  fetchCommentDelete,
  setOpenPost,
  resetOpenPost,
  fetchUpdateProf,
  fetchPostShare,
  fetchPostUnshare,
} = postSlice.actions;

export const selectOpenDeleteCommentForm = (state: RootState) =>  state.post.selectOpenDeleteCommentForm;
export const selectSelectedComment = (state: RootState) =>  state.post.selectedComment;
export const selectIsLoadingPost = (state: RootState) =>  state.post.isLoadingPost;
export const selectOpenPost = (state: RootState) => state.post.openPost;
export const selectNextPageLink = (state: RootState) => state.post.nextPageLink;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPost = (state: RootState) => state.post.post;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;