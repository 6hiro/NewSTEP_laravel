import React,  { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import { selectPosts } from '../Post/postSlice';
import { fetchAsyncGetSearchedPosts, fetchAsyncGetSearchedPostsLatest } from '../Post/postAsyncAction'
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';
import SearchForm from '../../components/layout/SearchForm';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PostSearch: React.FC = () => {
  // const { word } = useParams();
  const posts = useSelector(selectPosts);
  let navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  let query = useQuery();

  const fetchAsynSearchPostTop = async (keyword: string) => {
    if(keyword.length>0){
        const result = await dispatch(fetchAsyncGetSearchedPosts(keyword));
        if(fetchAsyncGetSearchedPosts.rejected.match(result)){
                // dispatch(setOpenLogIn());
                if(fetchAsyncGetSearchedPosts.rejected.match(result)){
                    if(result.error.message?.slice(-3)==="401"){
                        navigate("/auth/login");
                    }
                }
        }
        if(fetchAsyncGetSearchedPosts.fulfilled.match(result)){
            window.scrollTo(0, 0);
        }
    }
};
const fetchAsynSearchPostLatest = async (keyword :string) => {
    if(keyword.length>0){
        const result = await dispatch(fetchAsyncGetSearchedPostsLatest(keyword));
        if(fetchAsyncGetSearchedPostsLatest.rejected.match(result)){
            // dispatch(setOpenLogIn());
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }
        if(fetchAsyncGetSearchedPostsLatest.fulfilled.match(result)){
            window.scrollTo(0, 0);
        }
    }
};

  useEffect(()=>{
    const func = async () => {
      // const params = new URLSearchParams(window.location.search) ;
      // let q = params.get('q')
      // let s = params.get('section')
      const q = query.get("q");
      const section = query.get("section");
      console.log(q)

      if(q!==null && q.length!==0){
        if(section==="top"){
          fetchAsynSearchPostTop(q);
        }else if(section==="latest"){
          fetchAsynSearchPostLatest(q);
        }
      }
    }
    func();
  }, [dispatch, query])
  return (
    <div className="posts_list_container">
      {/* <div className="posts_list_container_title">検索：{word}</div> */}
      <div className="posts_list_container__header">
        <SearchForm keyword={String(query.get("q"))} section={String(query.get("section"))}  isPost={true}/>
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

export default PostSearch;