import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppDispatch } from "../../../app/store";
import {
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
} from "./postSlice";

const AddPostForm: React.FC= () => {
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const [content, setContent] = useState("");
    // Post追加の処理
    const postSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const data= {
          content: content,
        }
        dispatch(fetchPostStart());
        axios.post(`/api/post`, data).then(res => {
            toast.success('つぶやきを作成しました！');
            dispatch(fetchPostEnd());
            navigate("/")
        })
        .catch(function (error) {
            toast.error('エラーが発生しました');
            dispatch(fetchPostEnd());
            navigate("/auth/login")
        })
    }

    return (
        <div>
            <div className="add_post_form">
                <h1 className="add_post_form__title">つぶやき</h1>
                <div className="add_post_form__progress">
                    {isLoadingPost && <CircularProgress />}
                </div>

                <form className="add_post_form__input" >
                    <div className="add_post_form__input__content">
                        <textarea 
                            className=""
                            rows={8}
                            // cols={45}
                            minLength={1}
                            maxLength={250}
                            // placeholder="テキスト(100文字以内)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <span>テキスト(250文字以内)</span>
                    </div>
                    <br />
                    {/* <p>※入力できる文字数は250字です。</p> */}
                    <p>※ハッシュタグは半角を使ってください。</p>

                    <div className="add_post_form__input__submit">
                        <button
                            disabled={!content.length}
                            type="submit"
                            className="add_post_form__input__submit__button"
                            onClick={postSubmit}
                        >
                            投稿
                        </button>
                    </div>
                </form>
                    
            </div>
        </div>
    )
}

export default AddPostForm