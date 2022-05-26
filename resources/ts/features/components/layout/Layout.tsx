import React, { useEffect }  from 'react';
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './Sidebar';
import HumbergerMenu from './HumbergerMenu';
import { AppDispatch } from '../../../app/store';
import {
    fetchAsyncGetAccount,
} from "../../pages/Auth/authAsyncAction";

const Layout = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const isAuth = (window.location.pathname.slice(1, 5) === "auth")
    
    useEffect(()=>{
        // ログイン済みかどうか検証
        const func = async () => {
            const result = await dispatch(fetchAsyncGetAccount());
            if(fetchAsyncGetAccount.rejected.match(result)){
                if(result.error.message?.slice(-3)==="401"){
                    if(!isAuth){
                        navigate("/auth/login");
                    }
                }
            }
        };
        func();
    }, [])

    return (
        <>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    <ToastContainer
                        position='top-right'
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        transition={Zoom}
                        closeButton={true}
                    />
                    <HumbergerMenu />
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout;