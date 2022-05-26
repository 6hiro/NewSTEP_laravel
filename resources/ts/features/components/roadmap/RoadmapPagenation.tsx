import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../../app/store';
import { 
    selectNextPageLink,
} from '../../pages/Roadmap/roadmapSlice';
import {
    fetchAsyncGetRoadmapsMore,
} from  '../../pages/Roadmap/roadmapAsyncAction';


const RoadmapPagination: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const nextPageLink =useSelector(selectNextPageLink);

    const getNextRoadmap = async() => {
      const result = await dispatch(fetchAsyncGetRoadmapsMore(nextPageLink));
      if (fetchAsyncGetRoadmapsMore.rejected.match(result)) {
        if(result.error.message?.slice(-3)==="401"){
          navigate("/auth/login");
      }
      }
  }
    useEffect(() => {

    }, [dispatch])
    // const roadmaps = useSelector(selectRoadmaps);

    return (
        <>

          
            {nextPageLink ?
              <div
                className="pagination__next"
                onClick={getNextRoadmap}
              >
                次へ
                <i className='bx bx-caret-right'></i>
                {/* <i className='bx bx-chevron-right'></i> */}
              </div>
              :
              <div></div>
            }
        </>
    )
}

export default RoadmapPagination
