import React from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  selectOpenUpdateProfile,
  editProfileName,
  resetOpenProfile,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  selectProfile,
} from "../../pages/Auth/authSlice";
import {
  fetchAsyncUpdateProf,
} from "../../pages/Auth/authAsyncAction";

import {
  fetchUpdateProf,
} from "../../pages//Post/postSlice"
import { fetchUpdateRoadmapProf } from "../../pages/Roadmap/roadmapSlice";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(230, 230, 230, 0.6)", 
    // backdropFilter: "blur(5px)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 200,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile:React.FC = () => {
  Modal.setAppElement("#app");
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();
  const openProfile = useSelector(selectOpenUpdateProfile);
  const profile = useSelector(selectProfile);

  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  

  // 投稿のUpdateの処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet =  { 
      nick_name: profile.nick_name, 
      id: profile.id, 
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateProf(packet));
    if(fetchAsyncUpdateProf.rejected.match(result)){
      if(result.error.message?.slice(-3)==="401"){
        navigate("/auth/login");
      }
    }else if(fetchAsyncUpdateProf.fulfilled.match(result)){
        dispatch(fetchCredEnd());
        dispatch(fetchUpdateProf({postedBy: profile.id, nick_name: profile.nick_name}));
        dispatch(fetchUpdateRoadmapProf({postedBy: profile.id, nick_name: profile.nick_name}));
        dispatch(resetOpenProfile());
    }
  }

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
            dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <div className="edit_prof">
          <div className="edit_prof_title">プロフィール編集</div>
        
          <div className="edit_progress">
            {isLoadingAuth && <CircularProgress />}
          </div>

          <form className="edit_prof_form">
            <TextField
              id="standard-basic" label="ユーザーネーム（８文字以内）"
              type="text"
              fullWidth
              inputProps={{maxLength: 8}}
              value={profile?.nick_name}
              onChange={(e) => dispatch(editProfileName(e.target.value))}
            />
            <div className="edit_prof_button">
              <Button
                disabled={!profile?.nick_name}
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

export default EditProfile;