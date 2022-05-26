import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { blue, pink } from '@mui/material/colors';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import IconButton from '@mui/material/IconButton';

import { AppDispatch } from '../../../app/store';
import {
    selectMyUser,
    setProfilesTitleLikes,
    setOpenProfiles
} from '../../pages/Auth/authSlice' 
import{
    fetchAsyncGetLikesUser,
} from '../../pages/Auth/authAsyncAction' 
import { 
     fetchPostUnshare,
} from '../../pages/Post/postSlice';
import{
    fetchAsyncLikeUnlikePost, fetchAsyncSharePost, fetchAsyncUnsharePost
} from '../../pages/Post/postAsyncAction';


const Post: React.FC<{
    post: {
        id: string;
        content: string;
        user: {id: string; name: string, nick_name: string;};
        img: string;
        created_at: string;
        // updatedAt: string;
        is_public: boolean;
        is_liked: boolean;
        count_likes: number;
        is_shared: boolean;
        count_comments: number;
        tags: {
            id: string;
            name: string;
        }[];
        parent: {
            id: string;
            content: string;
            user: {id: string; name: string; nick_name: string;};
            img: string;
            created_at: string;
            // updatedAt: string;
            is_public: boolean;
            is_liked: boolean;
            count_likes: number;
            is_shared: boolean;
            count_comments: number;
            tags: {
                id: string;
                name: string;
            }[];
            // parent: null;
        };
    }
}> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const user = useSelector(selectMyUser);
    // const post = props.post;
    const isShared = props.post.is_shared;
    const post = (isShared || props.post.content===null) ? props.post.parent : props.post;


    // 文章内のハッシュタグやURLからリンク先に飛べるようにする
    const postEdit =(post:string, tags:{ id: string; name: string; }[]) => {      
        const tagIdList = tags.map((tag) =>tag.id)
        // タグの前に「#」を付ける
        const tagNameList = tags.map((tag)=> `#${tag.name}`)
    
        // 改行、半角スペース、全角スペースをを「特殊文字と同じ文字」に変更
        let postText = post.replaceAll(/\r?\n/g, '&nbsp;')
            .replaceAll(' ', '&ensp;')
            .replaceAll('　', '&emsp;')
        // 改行、半角スペース、または、全角スペースの「特殊文字と同じ文字」でテキストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let postList = postText.split(/(&nbsp;|&ensp;|&emsp;)/g)
        
        // 表示するテキストを生成
        const post_after: JSX.Element = <div>
            {postList.map((value, index) => {
            if( tagNameList.indexOf(value)!==-1 ){
                // ハッシュタグがついている要素
                // const tagId = tagIdList[tagNameList.indexOf(value)]
                return <span 
                            key={index} 
                            className="post_hashtag"
                            onClick={() => { navigate(`/post/hashtag/${value.slice(1)}`); }}
                        >
                            {value}
                        </span>
            }else if(value==='&nbsp;'){
                // 改行の要素
                return <br key={index}/>
            }else if(value==='&ensp;'){
                // 半角スペースの要素
                return <span key={index}>&ensp;</span>
            }else if(value==='&emsp;'){
                // 全角スペースの要素
                return <span key={index}>&emsp;</span>
            }else if(value.slice(0, 8)==='https://' || value.slice(0, 7)==='http://'){
                if(value.slice(0, 32)==='https://www.youtube.com/watch?v='){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(32)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else if(value.slice(0, 30)==='https://m.youtube.com/watch?v='){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(30)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else if(value.slice(0, 17)==='https://youtu.be/'){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(17)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else{
                    return <a href={value} key={index}>{value}</a>
                }
            }else{
                return <span key={index}>{value}</span>
                // return null
            }
            }
            )}
        </div>
        return post_after
        }

    return (
        <div className="post_container">
            {isShared && 
                <div className="post__shared_by">

                    <Link 
                        style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bolder'}} 
                        to={`/prof/${props.post.user.id}/`}
                    > 
                        <AutorenewIcon sx={{ fontSize: "0.9rem" }}/>
                        {props.post.user.nick_name}さんがシェア
                    </Link>
                </div>
            }
            <div className="post">

                <div className="post_icon">
                    <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${post.user.id}/`}
                    > 
                        <div>
                            <Avatar sx={{backgroundColor: "#F98010" ,}}>{post.user.nick_name.slice(0, 1)}</Avatar>
                            {/* <Avatar alt="who?" src={post.img} /> */}
                        </div>
                    </Link>
                </div>
                <div className="post_main">
                    <div className="post_main_header">
                        <Link 
                            style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                            to={`/prof/${post.user.id}/`}
                        > 
                            <div className="post_nick_name">
                                {post.user.nick_name}
                                <div className="post_user_name">@{post.user.name}</div>
                            </div>
                        </Link>
                    
                        <div className="posted_at">
                            {post.created_at}
                        </div>
                    </div>

                    <div className="post_text">
                        {postEdit(post.content, post.tags)}
                    </div>        

                    <div className="post_additional_elements">
                        <div>
                            <IconButton
                                aria-label="to comment list"
                                onClick={() => 
                                    navigate(`/post/${post.id}/`)
                                }

                            >
                                <ChatBubbleOutlineIcon fontSize="small"/>
                            </IconButton>
                            <span
                                className="post_likes"
                                onClick={() =>{
                                    navigate(`/post/${post.id}/`)
                                }} 
                            >
                                {post.count_comments}
                            </span>
                        </div>
                        <div>
                        {(props.post.is_shared && props.post.user.id === user.id) ?
                                    <IconButton
                                        aria-label="unshare-button"
                                        onClick={async() => {
                                            // navigate(`/post/${post.id}/`)
                                            const result = await dispatch(fetchAsyncUnsharePost(props.post.id));
                                            if(fetchAsyncUnsharePost.rejected.match(result)){
                                                if(result.error.message?.slice(-3)==="401"){
                                                    navigate("/auth/login");
                                                }
                                            }else if(fetchAsyncUnsharePost.fulfilled.match(result)){
                                                dispatch(fetchPostUnshare(props.post.id));
                                            }
                                        }}
                                    >
                                        <AutorenewIcon fontSize="small" sx={{ color: blue[500] }}/>
                                    </IconButton>
                                :
                                    <IconButton
                                        aria-label="share-button"
                                        onClick={async() => {
                                            const result = await dispatch(fetchAsyncSharePost(post.id));
                                            if(fetchAsyncSharePost.rejected.match(result)){
                                                if(result.error.message?.slice(-3)==="401"){
                                                    navigate("/auth/login");
                                                }
                                            }else if(fetchAsyncSharePost.fulfilled.match(result)){
                                              toast.success('シェアしました！');
                                            }
                                        }}
                                    >
                                        <AutorenewIcon fontSize="small"/>
                                    </IconButton>                             
                                }
                        </div>
                        <div>
                        <Checkbox
                                icon={<FavoriteBorder fontSize="small"/>}
                                checkedIcon={
                                    <Favorite fontSize="small" 
                                    sx={{ color: pink[500] }} 
                                />}
                                checked={post.is_liked}
                                onChange={()=>{
                                    dispatch(fetchAsyncLikeUnlikePost(post.id));
                                }}
                            />
                            <span
                                className="post_likes"
                                onClick={async() =>{
                                    if(post.count_likes>0){
                                        const result = await dispatch(fetchAsyncGetLikesUser(post.id));
                                        if(fetchAsyncGetLikesUser.rejected.match(result)){
                                            if(result.error.message?.slice(-3)==="401"){
                                              navigate("/auth/login");
                                            }                  
                                          }else if(fetchAsyncGetLikesUser.fulfilled.match(result)){
                                            dispatch(setOpenProfiles());
                                            dispatch(setProfilesTitleLikes());
                                          }

                                    }
                                }} 
                            >
                                {post.count_likes}
                            </span>
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    )
}

export default Post