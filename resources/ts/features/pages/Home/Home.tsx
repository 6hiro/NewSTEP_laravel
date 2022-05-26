import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../app/store';
import { selectMyUser } from '../Auth/authSlice';
import {  selectPosts } from '../Post/postSlice';
import { fetchAsyncGetFollowingsPosts } from '../Post/postAsyncAction';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();
  const user = useSelector(selectMyUser);
  const posts = useSelector(selectPosts);

  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetFollowingsPosts());
      if(fetchAsyncGetFollowingsPosts.rejected.match(result)){
        // console.log(result.error.message)
        if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
        }
      }
    }
    func();
  }, [dispatch])

  if(!user?.id){
    return null
  }
  
  return (
    <div className="posts_list_container">
      <div className="posts_list_container__header">
        <div className="navigation">
          <div
              className={`section  active`}
              onClick={async() => {
                const result = await dispatch(fetchAsyncGetFollowingsPosts());
              }}
          >
          つぶやき
          </div>
          <div
              className={`section`}
              onClick={() => {
                navigate(`/following/roadmap`);
              }}
          >
              ロードマップ
          </div>
        </div>
      </div>

      { posts[0]?.id &&
        <div className="posts posts_home">
          {
            posts
              .map((post, index) => ( 
                <div key={index} >
                  <Post post={post} />
                </div>
              ))
          }
        </div>
      }

      <GetMorePost />
      
    </div>

  )
}

export default Home