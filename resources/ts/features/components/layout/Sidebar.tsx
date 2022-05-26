import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

import { AppDispatch } from '../../../app/store';
import sidebarNav from '../../configs/sidebarNav'
import {
    selectMyUser,
    logOut,
} from "../../pages/Auth/authSlice";
import SwipeableTemporaryDrawer from './SwipeableTemporaryDrawer';

const Sidebar = () => {
    let navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectMyUser);
    const isLogin = user.name

    const closeSidebar = () => {
        setTimeout(() => {
            document.body.classList.remove('sidebar-open')
        }, 100);
    }
    const Logout = () => {
        axios.post(`/api/logout`).then(res => {
            //  user情報のstateをクリアする
            dispatch(logOut());
            document.body.classList.remove('sidebar-open')
            toast.success('ログアウトしました');
            navigate("/auth/login");
         })
         .catch(function (e) {
            toast.error('ログアウトに失敗しました！');
        })
    }

    return (
        <div className='sidebar'>
            <div className="sidebar__header">
                <div className="sidebar__header__logo">
                    {/* <i className='bx bx-paper-plane' ></i> */}
                    New<span>STEP</span> 
                </div>

                <div className="sidebar-close" onClick={closeSidebar}>
                    <i className='bx bx-x'></i>
                </div>
            </div>

            <div className="sidebar__menu">
                {isLogin &&
                    <div>
                        {/* Links */}
                        {
                            sidebarNav.map((nav, index) => (
                                <Link 
                                    to={nav.link+`${(nav.link === "/prof") ? '/'+user.id : ''}`} 
                                    key={`nav-${index}`} 
                                    className={`sidebar__menu__item`} 
                                    onClick={closeSidebar}
                                >
                                    <div className="sidebar__menu__item__icon">
                                        <i className={nav.icon} ></i>
                                    </div>
                                    <div className="sidebar__menu__item__txt">
                                        {nav.text}
                                    </div>
                                </Link>
                            ))
                        }
                        {/* 新規作成 */}
                        <SwipeableTemporaryDrawer />

                    </div>
                }
                
                {/* Auth Links */}
                <div>
                    {!isLogin ?
                        <>
                            <Link to="/auth/login" className="sidebar__menu__item" onClick={closeSidebar}>
                                <div className="sidebar__menu__item__icon">
                                    <i className='bx bx-log-in'></i>
                                </div>
                                <div className="sidebar__menu__item__txt">
                                    ログイン
                                </div>
                            </Link>
                            <Link to="/auth/register" className="sidebar__menu__item" onClick={closeSidebar}>
                                <div className="sidebar__menu__item__icon">
                                    <i className='bx bx-user-plus'></i>
                                </div>
                                <div className="sidebar__menu__item__txt">
                                    ユーザー登録
                                </div>
                            </Link>
                            {/* <Link to="/auth/forgot-password" className="sidebar__menu__item" onClick={closeSidebar}>
                                <div className="sidebar__menu__item__icon">
                                    <i className='bx bx-question-mark'></i>
                                </div>
                                <div className="sidebar__menu__item__txt">
                                    パスワード再設定
                                </div>
                            </Link> */}
                        </>
                    :
                        <div className="sidebar__menu__item"  onClick={Logout}>
                            <div className="sidebar__menu__item__icon">
                                <i className='bx bx-log-out'></i>
                            </div>
                            <div className="sidebar__menu__item__txt">
                                ログアウト
                            </div>
                        </div>
                    }
                </div>    
            </div>
        </div>
    )
}

export default Sidebar;