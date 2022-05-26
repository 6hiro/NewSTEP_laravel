import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../../app/store';
import {
    selectNextPageLink,
} from '../../pages/Post/postSlice';
import { 
    fetchAsyncGetMorePosts,
} from '../../pages/Post/postAsyncAction';

const GetMorePost: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const nextPageLink =useSelector(selectNextPageLink);
    
    const getMorePost = async() => {
        const result = await dispatch(fetchAsyncGetMorePosts(nextPageLink));
        if(fetchAsyncGetMorePosts.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }
    }

    return (
        <>
            {nextPageLink &&
                <div
                    className="getMorePostBtn"
                    onClick={getMorePost}
                >
                    さらに読み込む
                </div>
            }  
        </>
    )
}

export default GetMorePost
