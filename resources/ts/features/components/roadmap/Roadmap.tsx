import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Checkbox from '@mui/material/Checkbox';

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { AppDispatch } from '../../../app/store';
import {
    setOpenRoadmap,
    fetchRoadmapDelete,
}from '../../pages/Roadmap/roadmapSlice';
import {
    fetchAsyncDeleteRoadmap, 
    fetchAsyncSaveUnsaveRoadmap,
} from  '../../pages/Roadmap/roadmapAsyncAction';
import UpdateRoadmap from '../../components/roadmap/UpdateRoadmap';
// import RoadmapPagination from './RoadmapPagenation';
import GetMoreRoadmap from './GetMoreRoadmap';

const Roadmap: React.FC<{
    roadmaps: {
        id: string;
        title: string;
        overview: string;
        user: {
            id: string;
            name: string;
            nick_name: string;
        };
        created_at: string;
        updated_at: string;
        is_public: boolean;
        is_saved: boolean;
        count_saves: number;

    }[],
    loginId: string | undefined,
    // moreRoadmapLink: string | undefined,
}> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("");
    const [selectedRoadmapTitle, setSelectedRoadmapTitle] = useState<string>("");
    const [selectedRoadmapOverview, setSelectedRoadmapOverView] = useState<string>("");
    const [selectedRoadmapIsPublic, setSelectedRoadmapIsPublic] = useState<boolean>(true);

    // deleteの確認画面の表示を管理
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
    const handleClose = () => {
      setDeleteOpen(false);
    };

    const deleteRoadmap = async(roadmapId :string) => {
        const result = await dispatch(fetchAsyncDeleteRoadmap(roadmapId));
        if(fetchAsyncDeleteRoadmap.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncDeleteRoadmap.fulfilled.match(result)){
            dispatch(fetchRoadmapDelete(roadmapId));
            handleClose();
        }
    }
    const setOpenUpdateRoadmap = ((roadmap :any) => {
        setSelectedRoadmapId(roadmap.id)
        setSelectedRoadmapTitle(roadmap.title)
        setSelectedRoadmapOverView(roadmap.overview)
        setSelectedRoadmapIsPublic(roadmap.is_public)
        dispatch(setOpenRoadmap())
    })

    return (
        <>
            <div className="roadmaps">
            {
                props.roadmaps.map((roadmap, index) => ( 
                    <div key={index} className="roadmap">
                         <div>
                            <div className="roadmap__header">
                                <Link 
                                    to={`/prof/${roadmap.user.id}/`}
                                    className="roadmap__header__left"
                                > 
                                    {/* <div className=''> */}
                                        {/* by */}
                                        <Avatar
                                            sx={{backgroundColor: "#F98010" , width: 35, height: 35}}
                                        >
                                            {roadmap.user.name.slice(0, 1)}
                                        </Avatar>
                                    {/* </div> */}
                                </Link>
                                <div className="roadmap__header__right">
                                    <div
                                        className="roadmap__header__right__nick_name"    
                                    >
                                        <Link 
                                            style={{ color: '#000'}}
                                            to={`/prof/${roadmap.user.id}/`}
                                        > 
                                            {roadmap.user.name} @{roadmap.user.nick_name}
                                        </Link>
                                    </div>

                                    <div className="roadmap__header__right__dates">
                                        {roadmap.created_at!==roadmap.updated_at &&
                                            <div>{roadmap.updated_at}に更新</div>
                                            // :
                                            // <div></div>
                                            // <div>作成：{roadmap.created_at}</div>
                                        }
                                        <div>{roadmap.created_at}に作成</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                            <div className="roadmap__title">{roadmap.title}</div>
                            <div className="roadmap__overview">{roadmap.overview}</div>   
                        </div>
                        </div>

                        <div 
                            className={ `roadmap__additional_elements`}
                        >
                            <div className="icon">
                                {/* <div> */}
                                    <Checkbox
                                        icon={<BookmarkBorderIcon fontSize="small"/>}
                                        checkedIcon={
                                            <BookmarkIcon fontSize="small"
                                            // sx={{ color: blue }} 
                                        />}
                                        // color="success"
                                        checked={roadmap.is_saved}
                                        onChange={()=>{
                                            dispatch(fetchAsyncSaveUnsaveRoadmap(roadmap.id));
                                        }}
                                    />
                                    <span
                                        className="icon__saves"
                                        onClick={async() =>{
                                            if(roadmap.count_saves>0){
                                                // await dispatch(fetchAsyncGetLikesUser(roadmap.id));
                                                // dispatch(setOpenProfiles());
                                                // dispatch(setProfilesTitleLikes());
                                            }
                                        }} 
                                    >
                                        {roadmap.count_saves}
                                    </span>
                                {/* </div> */}

                                { roadmap.user.id === props.loginId &&
                                    <>
                                        <IconButton 
                                            aria-label="update" 
                                            // className={classes.margin}
                                            onClick={() => setOpenUpdateRoadmap(roadmap)}
                                        >
                                            <CreateOutlinedIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton 
                                            aria-label="delete" 
                                            // className={classes.margin}
                                            onClick={() => {
                                                setSelectedRoadmapId(roadmap.id);
                                                setSelectedRoadmapTitle(roadmap.title);
                                                handleClickOpen();
                                            }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </>                                      
                                }
                            </div>
                                              
                            <div 
                                onClick={() => { 
                                    navigate(`/step/roadmap/${roadmap.id}/`); 
                                }}
                                className="to_steps" 
                            >
                                <IconButton 
                                    aria-label="update" 
                                >
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
   
                ))
            }
            </div>

            {/* <RoadmapPagination /> */}
            <GetMoreRoadmap />

            <UpdateRoadmap roadmapId={selectedRoadmapId} title={selectedRoadmapTitle} overview={selectedRoadmapOverview} isPublic={selectedRoadmapIsPublic} />
            
            <Dialog
                open={deleteOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {selectedRoadmapTitle} を削除しますか？
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={async() => {deleteRoadmap(selectedRoadmapId);}} color="primary">
                    はい
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    いいえ
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Roadmap