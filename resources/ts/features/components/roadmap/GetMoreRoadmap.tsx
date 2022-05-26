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

const GetMoreRoadmap: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const nextPageLink =useSelector(selectNextPageLink);


    const getMoreRoadmap = async() => {
        const result = await dispatch(fetchAsyncGetRoadmapsMore(nextPageLink));
        if(fetchAsyncGetRoadmapsMore.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }
    }

    useEffect(() => {
    }, [dispatch])

    return (
        <>
            {nextPageLink &&
                <div
                    className="getMorePostBtn"
                    onClick={getMoreRoadmap}
                >
                    さらに読み込む
                </div>
            }  
        </>
    )
}

export default GetMoreRoadmap
