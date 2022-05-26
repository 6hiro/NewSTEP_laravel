import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import {
  selectRoadmaps
}from './roadmapSlice';
import {
  fetchAsyncGetFollowingsRoadmaps,
} from  '../../pages/Roadmap/roadmapAsyncAction';
import Roadmap from '../../components/roadmap/Roadmap';
import { selectMyUser } from '../Auth/authSlice';
// import { fetchAsyncRefreshToken, selectMyProfile } from '../Auth/authSlice';


const FollowingRoadmap: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();
  const user = useSelector(selectMyUser);
//   const loginId = user.id
  const roadmaps = useSelector(selectRoadmaps);

  
  useEffect(()=>{
    const func = async () => {
        const result = await dispatch(fetchAsyncGetFollowingsRoadmaps());
        if(fetchAsyncGetFollowingsRoadmaps.rejected.match(result)){
          if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
          }
        }
    }
    func();
  }, [dispatch])

  if(!roadmaps){
    return null
  }

  return (
    <div className="roadmaps_container roadmaps_container_home">
        {/* <div className="posts_list_container_title">検索：{word}</div> */}
        <div className="posts_list_container__header">
          <div className="navigation">
              <div
                  className={`section`}
                  onClick={() => {
                        navigate(`/`);
                  }}
              >
              つぶやき
              </div>
              <div
                  className={`section active`}

                  onClick={async() => {
                      const result = await dispatch(fetchAsyncGetFollowingsRoadmaps());
                      if(fetchAsyncGetFollowingsRoadmaps.rejected.match(result)){
                        if(result.error.message?.slice(-3)==="401"){
                          navigate("/auth/login");
                        }
                      }
                  }}
              >
                  ロードマップ
              </div>
              
          </div>
        </div>

        <Roadmap roadmaps={roadmaps} loginId={user.id} />

    </div>
  )
}

export default FollowingRoadmap