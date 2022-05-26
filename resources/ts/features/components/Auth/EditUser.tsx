import React from "react";
import { useNavigate } from "react-router-dom";

import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { AppDispatch } from "../../../app/store";

import {
  selectMyUser,
  editUserName,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  selectOpenUpdateUser,
  resetOpenUser,
} from "../../pages/Auth/authSlice";
import {
  fetchAsyncUpdateAccountName
} from "../../pages/Auth/authAsyncAction"

const customStyles = {
  overlay: {
    backgroundColor: "rgba(230, 230, 230, 0.9)", 
    // backdropFilter: "blur(5px)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 150,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditUser:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();
  const openUser = useSelector(selectOpenUpdateUser);
  const user = useSelector(selectMyUser);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  // 投稿のUpdateの処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet =  { 
      name: user.name, 
      id: user.id, 
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateAccountName(packet));
    if(fetchAsyncUpdateAccountName.rejected.match(result)){
      if(result.error.message?.slice(-3)==="401"){
        navigate("/auth/login");
      }
    }else if(fetchAsyncUpdateAccountName.fulfilled.match(result)){
        dispatch(fetchCredEnd());
        dispatch(resetOpenUser());
    }

  }

  return (
    <>
      <Modal
        isOpen={openUser}
        onRequestClose={async () => {
            dispatch(resetOpenUser());
        }}
        style={customStyles}
      >
        <div className="edit_prof">        
          <div className="edit_progress">
            {isLoadingAuth && <CircularProgress />}
          </div>

          <form className="edit_prof_form">
            <TextField
              id="standard-basic" label="ユーザーネーム（８文字以内）"
              type="text"
              fullWidth
              inputProps={{maxLength: 8 }}
              value={user.name}
              onChange={(e) => {
                if(e.target.value.match(/^[a-zA-Z0-9_]+$/)){
                    dispatch(editUserName(e.target.value))
                }
              }}
            />
            <div className="edit_prof_button">
              <Button
                disabled={!user.name}
                // variant="contained"
                variant="outlined"
                color="primary"
                type="submit"
                onClick={updateProfile}
              >
                ユーザーネームを変更
              </Button>
            </div>
          </form>        
        </div>
      </Modal>
    </>
  );
};

export default EditUser;