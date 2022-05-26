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
    const setFillHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      // 画面のサイズ変動があった時に高さを再計算する
      window.addEventListener('resize', setFillHeight);
      
      // 初期化
      setFillHeight();
      
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
                <div className={`main__content ${isAuth ? "main__content_auth" :""}`}>
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