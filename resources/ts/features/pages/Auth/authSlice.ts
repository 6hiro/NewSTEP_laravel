import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import {
  fetchAsyncGetAccount,
  fetchAsyncUpdateAccountName, 
  fetchAsyncUpdateProf,
  fetchAsyncGetProfrile,
  fetchAsyncFollowUnFollow, 
  fetchAsyncGetFollowings, 
  fetchAsyncGetFollowers,
} from "./authAsyncAction";

export const authSlice = createSlice({
  // action typesで使われる名前 
  name: "auth",
  // Stateの初期状態
  initialState: {
    // error: "",
    openUpdateUser: false,

    openUpdateProfile: false,
    openProfiles: false,
    isLoadingAuth: false,
    profilesTitle: "",
    user: {
      id: "",
      name: "",
      nick_name: "",
    },
    profile: {
      id: "",
      name: "",
      nick_name: "",
      isFollowed: false,
      followers: 0,
      following:  0,
    },
    profiles: [
      {
        id: "",
        name: "",
        nick_name: "",
        isFollowed: false,
        followers: 0,
        following:  0,
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenUser(state) {
      state.openUpdateUser = true;
    },
    resetOpenUser(state) {
      state.openUpdateUser = false;
    },
    setOpenProfile(state) {
      state.openUpdateProfile = true;
    },
    resetOpenProfile(state) {
      state.openUpdateProfile = false;
    },
    setOpenProfiles(state) {
      state.openProfiles = true;
    },
    resetOpenProfiles(state) {
      state.openProfiles = false;
    },
    setProfilesTitleFollowings(state){
      state.profilesTitle = "フォロー"
    },
    setProfilesTitleFollowers(state){
      state.profilesTitle = "フォロワー"
    },
    setProfilesTitleLikes(state){
      state.profilesTitle = "いいね"
    },
    setUser(state, action){
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.nick_name = action.payload.nick_name;
    },
    editProfileName(state, action){
      state.profile.nick_name = action.payload;
    },
    editUserName(state, action){
      state.user.name = action.payload;
    },
    logOut(state) {
      state.user.id = ""
      state.user.name = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetAccount.fulfilled, (state, action) => {
      state.user.id = action.payload.data.id;
      state.user.name = action.payload.data.name;
      state.user.nick_name = action.payload.data.nick_name;
    });
    builder.addCase(fetchAsyncUpdateAccountName.fulfilled, (state, action) => {
      state.user.name= action.payload.userName;
      state.profile.name = action.payload.userName;
    })
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.user.nick_name= action.payload.nick_name;
      state.profile.nick_name = action.payload.nick_name;
    })
    builder.addCase(fetchAsyncGetProfrile.fulfilled, (state, action) => {
      state.profile.id = action.payload.data.id;
      state.profile.name = action.payload.data.name;
      state.profile.nick_name = action.payload.data.nick_name;

      state.profile.isFollowed = action.payload.data.isFollowedBy;
      state.profile.following = action.payload.data.count_followings;
      state.profile.followers = action.payload.data.count_followers;
    });
    builder.addCase(fetchAsyncGetFollowings.fulfilled, (state, action) => {
      state.profiles = action.payload.data;
    });
    builder.addCase(fetchAsyncGetFollowers.fulfilled, (state, action) => {
      state.profiles = action.payload.data;
    });
    builder.addCase(fetchAsyncFollowUnFollow.fulfilled, (state, action) => {
      if(action.payload.result==='follow'){
        state.profile.followers = action.payload.count_followers;
        state.profile.isFollowed = true;
      }
      else if(action.payload.result==='unfollow'){
        state.profile.followers = action.payload.count_followers;
        state.profile.isFollowed = false;
      }
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenUser,
  resetOpenUser,
  setOpenProfile,
  resetOpenProfile,
  setOpenProfiles,
  resetOpenProfiles,
  setProfilesTitleFollowers,
  setProfilesTitleFollowings,
  setProfilesTitleLikes,
  editProfileName,
  setUser,
  editUserName,
  logOut,
} = authSlice.actions;

export const selectMyUser = (state: RootState) => state.auth.user;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectProfilesTitle = (state: RootState) => state.auth.profilesTitle;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenUpdateProfile= (state: RootState) => state.auth.openUpdateProfile;
export const selectOpenProfiles= (state: RootState) => state.auth.openProfiles;
export const selectOpenUpdateUser= (state: RootState) => state.auth.openUpdateUser;


export default authSlice.reducer;