import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { fetchSelectedComment, setOpenDeleteCommentForm } from '../../pages/Post/postSlice';
import { Avatar } from '@mui/material';

const Comment: React.FC<{
    comment:{
        id: string;
        content: string,
        user: {id: string, name: string, nick_name: string},
        created_at: string,
    },
    index: number,
    loginId: string,
}> = (props) => {
  const dispatch: AppDispatch = useDispatch();

    const openDeleteCommentForm = ((step :{
        id: string;
        content: string;
    }) => {
        dispatch(fetchSelectedComment(step));
        dispatch(setOpenDeleteCommentForm())
    })

  return (
    <div  className="comment">
        <div className="comment_icon">
        <Link 
            style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
            to={`/prof/${props.comment.user.id}/`}
        > 
            <div>
            <Avatar>{props.comment.user.name.slice(0, 1)}</Avatar>
            {/* <Avatar src={ comment.img }/> */}
            </div>
        </Link>
        </div>
        <div className="comment_main">
        <div className="comment_main_header">
            <Link 
            style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
            to={`/prof/${props.comment.user.id}/`}
            > 
                <div className="comment_nick_name">
                    {props.comment.user.nick_name}
                    <div className="comment_user_name">@{props.comment.user.name}</div>
                </div>
            </Link>
            <div className="commented_at">
            {props.comment.created_at}
            </div>
        </div>

        <div className="comment_text">{props.comment.content}</div>


        {props.comment.user.id === props.loginId &&
            <div className="comment_footer">
            <div 
                className="delete_comment" 
                onClick={() => openDeleteCommentForm({
                    id: props.comment.id,
                    content: props.comment.content,
                })}
                >
                    削除
                </div>
            </div>
        }
        </div>
  </div>
  )
}

export default Comment