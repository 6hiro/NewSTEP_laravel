import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// material UI
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';

import { AppDispatch } from '../../../app/store';
import {

    selectMyUser,
    selectProfile,
    setOpenProfile,
    setOpenProfiles,
    setProfilesTitleFollowings,
    setProfilesTitleFollowers,
} from "../Auth/authSlice";
import{
  fetchAsyncGetProfrile,
  fetchAsyncGetFollowings,
  fetchAsyncGetFollowers,
  fetchAsyncFollowUnFollow,
} from "../Auth/authAsyncAction";
import { 

    selectPosts, 
} from '../Post/postSlice';
import { 
  fetchAsyncGetUserPosts,
  fetchAsyncGetLikedPosts,
} from '../Post/postAsyncAction'

import Post from '../../components/post/Post';
import EditProfile from "../../components/profile/EditProfile";
import GetMorePost from '../../components/post/GetMorePost';
import Roadmap from '../../components/roadmap/Roadmap';
import { selectRoadmaps } from '../Roadmap/roadmapSlice';
import {
  fetchAsyncGetUserRoadmaps, 
  fetchAsyncGetSavedRoadmaps,
} from  '../../pages/Roadmap/roadmapAsyncAction';

const Profile: React.FC = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectMyUser);
    const profile = useSelector(selectProfile);
    const posts = useSelector(selectPosts);
    const roadmaps = useSelector(selectRoadmaps);

    const handlerFollowed = async () => {
        const result = await dispatch(fetchAsyncFollowUnFollow(profile.id));
        if(fetchAsyncFollowUnFollow.rejected.match(result)){
          if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
          }
        }
    };

    useEffect(() => {
        const func = async () => {
          const resultOne = await dispatch(fetchAsyncGetProfrile(id));
          if(fetchAsyncGetProfrile.rejected.match(resultOne)){
            if(resultOne.error.message?.slice(-3)==="401"){
              navigate("/auth/login");
            }
          }
          const resultTwo= await dispatch(fetchAsyncGetUserPosts(id));
          if(fetchAsyncGetUserPosts.rejected.match(resultTwo)){
            if(resultTwo.error.message?.slice(-3)==="401"){
              navigate("/auth/login");
            }
          }
            handleIsUserPosts();
          };
          func();
    }, [dispatch, id])

    // 表示されている投稿一覧が、ユーザーの投稿かユーザーがいいねをした投稿一覧かの状態を管理
    const [navName, setNavName] = useState<string>("userPosts");
    const handleIsUserPosts = () => {
      setNavName("userPosts");
    }
    const handleIsFavoritePosts = () => {
      setNavName("favoritePosts");
    }
    const handleIsUserRoadmaps = () => {
      setNavName("userRoadmaps");
    }
    const handleIsFavoriteRoadmaps = () => {
      setNavName("favoriteRoadmaps");
    }

    const getFavoritePosts = async () => {
        const result = await dispatch(fetchAsyncGetLikedPosts(id));
        if(fetchAsyncGetLikedPosts.rejected.match(result)){
          if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
          }
        }else if(fetchAsyncGetLikedPosts.fulfilled.match(result)){
          handleIsFavoritePosts();
          window.scrollTo(0, 0);    
        }
    };
      const getUserPosts = async () => {
        const result = await dispatch(fetchAsyncGetUserPosts(id))
        if(fetchAsyncGetUserPosts.rejected.match(result)){
          if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
          }
        }else if(fetchAsyncGetUserPosts.fulfilled.match(result)){
          handleIsUserPosts();
          window.scrollTo(0, 0);
        }
    };
    const getFavoriteRoadmaps = async () => {
      const result = await dispatch(fetchAsyncGetSavedRoadmaps(id));
      if(fetchAsyncGetSavedRoadmaps.rejected.match(result)){
        if(result.error.message?.slice(-3)==="401"){
          navigate("/auth/login");
        }
      }else if(fetchAsyncGetSavedRoadmaps.fulfilled.match(result)){
        handleIsFavoriteRoadmaps();
        window.scrollTo(0, 0);
      }
    };
    const getUserRoadmaps = async () => {
      const result = await dispatch(fetchAsyncGetUserRoadmaps(id))
      if(fetchAsyncGetUserRoadmaps.rejected.match(result)){
        if(result.error.message?.slice(-3)==="401"){
          navigate("/auth/login");
        }
      }else if(fetchAsyncGetUserRoadmaps.fulfilled.match(result)){
        handleIsUserRoadmaps();
        window.scrollTo(0, 0);
      }
  };
    return (
        <div className="profile">
          <div className="profile_header">
            <div className="profile_header__name">
              <div>
                  <Avatar  sx={{backgroundColor: "#F98010" , fontSize: "2.8rem" ,width: 65, height: 65}}>
                    {profile.nick_name.slice(0, 1)}
                  </Avatar>
              </div>
              <div className="nick_name">
                {profile?.nick_name}
                <div className="user_name">@{profile?.name}</div>
              </div>
            </div>

            <>
              {profile.id!==user.id ? (
                <div className="follow_button">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        icon={<PersonOutlineIcon sx={{ color: 'white' }}  />}
                        checkedIcon={<PersonIcon sx={{ color: 'white' }} />}
                        checked={profile.isFollowed}
                        // checked={ profile.followers.some((follow) => follow === user.id)}
                        onChange={handlerFollowed}
                        name="checked" 
                      />
                    }
                    label = {profile.isFollowed ? "アンフォロー" : "フォロー"}
                  />
                </div>
              ):(
                <>
                  <div
                    className="edit_profile"
                    onClick={() => {
                      dispatch(setOpenProfile());
                    }}
                  >
                    <div>
                      プロフィールを編集
                    </div>
                  </div>
                </>
              )}
            </>
            
            {/* フォロー数・フォロワー数 */}
            <div className="follow">
              <span 
                className="following"
                onClick={async() => {
                    if(profile.following>0){
                      const result = await dispatch(fetchAsyncGetFollowings(profile.id));
                      if(fetchAsyncGetFollowings.rejected.match(result)){
                        if(result.error.message?.slice(-3)==="401"){
                          navigate("/auth/login");
                        }
                      }else if(fetchAsyncGetFollowings.fulfilled.match(result)){
                        dispatch(setOpenProfiles());
                        dispatch(setProfilesTitleFollowings());
                      }
                    }
                }}
              >
                {Number(profile.following).toLocaleString()} フォロー
              </span>

              <span 
                className="follower"
                onClick={async() => {
                  if(profile.followers>0){
                    const result = await dispatch(fetchAsyncGetFollowers(profile.id));
                    if(fetchAsyncGetFollowers.rejected.match(result)){
                      if(result.error.message?.slice(-3)==="401"){
                        navigate("/auth/login");
                      }
                    }else if(fetchAsyncGetFollowers.fulfilled.match(result)){
                      dispatch(setOpenProfiles());
                      dispatch(setProfilesTitleFollowers());
                    }
                  }
                }}
              >
                {Number(profile.followers).toLocaleString()} フォロワー
              </span>
            </div>
            <hr/>

            {/* ナビゲーション */}
            <div className="navigation">
              <div
                className={navName==="userPosts" ? `nav nav_active`: `nav`}
                onClick={getUserPosts}
              >
                {/* <i className='bx bx-comment-detail'></i> */}
                つぶやき
              </div>
              <div
                className={navName==="userRoadmaps" ? `nav nav_active`: `nav`}
                onClick={getUserRoadmaps}
              >
                {/* <i className='bx bx-paper-plane'></i> */}
                ロードマップ
              </div>
              <div
                className={navName==="favoritePosts" ? `nav nav_active`: `nav`}
                onClick={getFavoritePosts}
              >
                {/* <i className='bx bx-heart'></i> */}
                いいね
              </div>
              {profile.id===user.id &&
                <div
                  className={navName==="favoriteRoadmaps" ? `nav nav_active`: `nav`}
                  onClick={getFavoriteRoadmaps}
                >
                  {/* <i className='bx bx-bookmark' ></i> */}
                  保存
                </div>
              }
            </div>
            </div>
            {/* 投稿一覧 */}
            {(navName==="userPosts" || navName==="favoritePosts")  ? 
              <div className="posts">
                {
                    posts
                    .map((post, index) => ( 
                        <div key={index} >
                        <Post post={post} />
                        </div>
                    ))
                }
                <GetMorePost />
              </div>
            :
              <div className="roadmaps_container">
                <Roadmap roadmaps={roadmaps} loginId={user.id}/>
              </div>
            }
            
            <EditProfile />

        </div>
    )
}

export default Profile