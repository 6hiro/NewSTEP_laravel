import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// import Avatar from '@mui/material/Avatar';

import { AppDispatch } from '../../../app/store';
import {
  selectRoadmaps,
}from '../Roadmap/roadmapSlice';
import {
  fetchAsyncGetSearchedRoadmap,
  fetchAsyncGetSearchedRoadmapLatest
} from  '../../pages/Roadmap/roadmapAsyncAction';
import {  selectMyUser } from '../Auth/authSlice';
import Roadmap from '../../components/roadmap/Roadmap';
import SearchForm from '../../components/layout/SearchForm';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const RoadmapSearch: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();

  const user = useSelector(selectMyUser);
  const loginId = user.id
  const roadmaps = useSelector(selectRoadmaps);
  let query = useQuery();

  const fetchAsynSearchRoadmapTop = async (keyword: string) => {
    if(keyword.length>0){
        const result = await dispatch(fetchAsyncGetSearchedRoadmap(keyword));
        if(fetchAsyncGetSearchedRoadmap.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncGetSearchedRoadmap.fulfilled.match(result)){
            window.scrollTo(0, 0);
        }
    }
  };
  const fetchAsynSearchRoadmapLatest = async (keyword: string) => {
    if(keyword.length>0){
      const result = await dispatch(fetchAsyncGetSearchedRoadmapLatest(keyword));
      if(fetchAsyncGetSearchedRoadmapLatest.rejected.match(result)){
        if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
        }
      }else if(fetchAsyncGetSearchedRoadmapLatest.fulfilled.match(result)){
        window.scrollTo(0, 0);
      }
    }
  };

  useEffect(()=>{
    const func = async () => {
      const q = query.get("q");
      const section = query.get("section");
      if(q!==null && q.length!==0){
        if(section==="top"){
          fetchAsynSearchRoadmapTop(q);
        }else if(section==="latest"){
          fetchAsynSearchRoadmapLatest(q);
        }
      }
    }
    func();
  }, [dispatch, query])

  return (
    <div className="roadmaps_container">
      <div className="roadmaps_container__header">
        {/* <PostSearchForm keyword=''/> */}
        <SearchForm keyword={String(query.get("q"))} section={String(query.get("section"))}  isPost={false}/>

        {/* <Child name={} /> */}
      </div>
        
      <Roadmap roadmaps={roadmaps} loginId={user.id} />
    </div>
  )
}

export default RoadmapSearch;