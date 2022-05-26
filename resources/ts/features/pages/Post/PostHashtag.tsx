import React,  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import { 
  selectPosts, 
} from '../Post/postSlice';
import { 
  fetchAsyncGetHashtagLatestPosts,
  fetchAsyncGetHashtagPosts,
} from '../Post/postAsyncAction';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';

const PostHashtag: React.FC = () => {
  const { name } = useParams();
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const posts = useSelector(selectPosts);

    const [isTop, setIsTop] = useState<boolean>(true);

    useEffect(()=>{
      const func = async () => {
        const result = await dispatch(fetchAsyncGetHashtagPosts(name));
        if(fetchAsyncGetHashtagPosts.rejected.match(result)){
          if(result.error.message?.slice(-3)==="401"){
              navigate("/auth/login");
          }
        }
      }
      func();
    }, [dispatch, name])

    return (
      <div className="posts_list_container">
        <div className="posts_list_container__header">

          <div className="posts_list_container_title">
            #{name}
          </div>
          <div className="navigation">
            <div 
              className={isTop ? `section active` : 'section'}
              onClick={async() => {
                const result = await dispatch(fetchAsyncGetHashtagPosts(name));
                if(fetchAsyncGetHashtagPosts.rejected.match(result)){
                    // console.log(result.error.message)
                  if(result.error.message?.slice(-3)==="401"){
                      navigate("/auth/login");
                  }
                }else if(fetchAsyncGetHashtagPosts.fulfilled.match(result)){
                  setIsTop(true);
                  window.scrollTo(0, 0);
                }
              }}
            >
              トップ
            </div>
            <div
                className={!isTop ? `section active` : 'section'}
                onClick={async() => {
                  const result = await dispatch(fetchAsyncGetHashtagLatestPosts(name));
                  if(fetchAsyncGetHashtagLatestPosts.rejected.match(result)){
                    if(result.error.message?.slice(-3)==="401"){
                      navigate("/auth/login");
                    }                  
                  }else if(fetchAsyncGetHashtagLatestPosts.fulfilled.match(result)){
                    setIsTop(false);
                    window.scrollTo(0, 0);
                  }
                }}
            >
                最新
            </div>
          </div>
        </div>
        <div className="posts">
          {
            posts
            .map((post, index) => ( 
                <div key={index} >
                  <Post post={post} />
                </div>
            ))
          }
        </div>

        <GetMorePost />
      
      </div>
    )
}

export default PostHashtag;