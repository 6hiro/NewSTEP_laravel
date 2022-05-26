import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// material UI
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import { AppDispatch } from '../../../app/store';
import {
  selectMyUser
} from '../Auth/authSlice';
import { 
  resetOpenDeleteCommentForm,
  fetchCommentDelete,
  fetchPostStart,
  fetchPostEnd,
  selectPost, 
  selectComments,
  selectOpenDeleteCommentForm,
  selectSelectedComment
} from '../Post/postSlice';
import { 
  fetchAsyncGetPost,
  fetchAsyncDeletePost,
  fetchAsyncPostComment, 
  fetchAsyncDeleteComment,
} from '../Post/postAsyncAction';
import Post from '../../components/post/Post';
import Comment from '../../components/post/Comment';

const PostDetail = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  
  const user = useSelector(selectMyUser);
  const loginId = user.id;
  const post = useSelector(selectPost);
  const comments = useSelector(selectComments);
  const isOpenDeleteCommentForm = useSelector(selectOpenDeleteCommentForm);
  const selectedComment = useSelector(selectSelectedComment);


  // 追加するコメント
  const [comment, setComment] = useState("");
  // コメント入力の処理
  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { content: comment, post_id: id };
    dispatch(fetchPostStart());
    const result = await dispatch(fetchAsyncPostComment(packet));
    if(fetchAsyncPostComment.rejected.match(result)){
      if(result.error.message?.slice(-3)==="401"){
        dispatch(fetchPostEnd());
        navigate("/auth/login");
      }
    }
    dispatch(fetchPostEnd());
    setComment("");
  };

  // 投稿削除の画面の表示
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setDeleteOpen(true);
  };
  const handleClose = () => {
    setDeleteOpen(false);
  };
  // 投稿削除の処理
  const PostDelete = async() => {
    const result = await dispatch(fetchAsyncDeletePost(String(id)));
    if(fetchAsyncDeletePost.rejected.match(result)){
      if(result.error.message?.slice(-3)==="401"){
          navigate("/auth/login");
      }
    }else if(fetchAsyncDeletePost.fulfilled.match(result)){
      navigate(-1);
    }
  }

  const closeDeleteCommentForm = () => {
    dispatch(resetOpenDeleteCommentForm())
  };

// コメント削除の処理
  const deleteComment = async(commentId :string) =>{
    const result = await dispatch(fetchAsyncDeleteComment(commentId));
    if(fetchAsyncDeleteComment.rejected.match(result)){
      if(result.error.message?.slice(-3)==="401"){
          navigate("/auth/login");
      }
    }
    dispatch(fetchCommentDelete(commentId));
    closeDeleteCommentForm();
  }

  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetPost(id));
      if(fetchAsyncGetPost.rejected.match(result)){
        if(result.error.message?.slice(-3)==="401"){
            navigate("/auth/login");
        }
      }
      
    };
    func();
  }, [dispatch])
  
  return (
    <div className="post_detail_container">
      {/* 投稿の更新・削除のアイコンボタン */}
      <div className="post_detail_area">
        {user.id === post.user.id && 
          <div className="delete_update_button">
            <IconButton 
              aria-label="delete"
              onClick={handleClickOpen}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        }

        {/* 投稿内容 */}
        <Post post={post} />
      
      </div>

      <div className="comments_area">

        {/* コメントフォーム */}
        <form className="comment_form">
          <div className='comment_form__input__content'>
            <textarea 
                // type="text"
                rows={5}
                // cols={45}
                minLength={1}
                maxLength={250}
                required
                // placeholder="素敵なコメント(250文字以内)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <span>素敵なコメント(250文字以内)</span>
          </div>

          <div
            className="comment_button_style"
          >
            <button
                disabled={!comment.length}
                type="submit"
                className="comment_button"
                onClick={postComment}
            >
                送信
            </button>
          </div>
        </form>
        <br />
        {/* コメント一覧 */}
        {comments[0]?.id && 
          <div className="comments">
            <div className="comments__title"><i className='bx bxs-comment'></i>コメント</div>
            {comments.map((comment, index) => (
              <div key={index} >
                <Comment index={index} comment={comment} loginId={loginId}/>
              </div>
            ))}
          </div>
        }
        {/* 投稿削除の確認画面 */}
        <Dialog
          open={deleteOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"つぶやきの削除"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {post.content.slice(0, 10)}…  を削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={PostDelete} 
              variant="outlined"
              color="primary"
            >
              はい
            </Button>
            <Button 
              onClick={handleClose}
              variant="outlined"
              color="primary" 
              autoFocus
            >
              いいえ
            </Button>
          </DialogActions>
        </Dialog>

        {/* コメント削除の確認画面 */}
        <Dialog
            open={isOpenDeleteCommentForm}
            onClose={closeDeleteCommentForm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"コメントの削除"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {selectedComment.content}  を削除しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button 
                onClick={() => {deleteComment(selectedComment.id);}} 
                color="primary">
                はい
            </Button>
            <Button 
                onClick={closeDeleteCommentForm} 
                color="primary" autoFocus>
                いいえ
            </Button>
            </DialogActions>
        </Dialog>
        {/* 投稿の編集モーダル */}
        {/* <UpdatePost postId={post.id} isPublic={post.is_public} /> */}
      </div>

    </div>
  )
}

export default PostDetail
