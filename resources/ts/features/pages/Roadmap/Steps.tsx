import React, { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { AppDispatch } from '../../../app/store';
import AddStepButton from '../../components/roadmap/AddStepButton';
import DoughnutChart from '../../components/chart/DoughnutChart';
import Step from '../../components/roadmap/Step';
import AddStepForm from '../../components/roadmap/AddStepForm';
import UpdateStepForm from '../../components/roadmap/UpdateStepForm';
import { 
    selectSteps,
    selectRoadmap,
    setOpenAddStepForm,
    selectOpenDeleteStepForm,
    selectOpenChangeStepOrderButton,
    selectStateCounts,
    selectselectedStep,
    resetOpenDeleteStepForm,
    fetchStepDelete,
    resetOpenChangeStepOrderButton,
    fetchStepStateCount,
} from './roadmapSlice';
import {
    fetchAsyncDeleteStep,
    fetchAsyncGetSteps,
    fetchAsyncChangeStepOrder,
} from  '../../pages/Roadmap/roadmapAsyncAction';
import {
     selectMyUser 
} from '../Auth/authSlice';
import Memo from '../../components/roadmap/Memo';

const Steps: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();

    const { id } = useParams();
    const user = useSelector(selectMyUser);
    const loginId = user.id;
    const roadmap = useSelector(selectRoadmap);
    const steps = useSelector(selectSteps);
    const stateCounts = useSelector(selectStateCounts);
    const selectedStep = useSelector(selectselectedStep);

    const openAddStepForm = () => {
        dispatch(setOpenAddStepForm())
    };

    // Step?????????
    const openDeleteStepForm = useSelector(selectOpenDeleteStepForm);
    const closeDeleteStepForm = () => {
        dispatch(resetOpenDeleteStepForm())
    };
    const deleteStep = async(stepId :string) =>{
        const result = await dispatch(fetchAsyncDeleteStep(stepId));
        if(fetchAsyncDeleteStep.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncDeleteStep.fulfilled.match(result)){
            dispatch(fetchStepDelete(stepId));
            dispatch(fetchStepStateCount());
            closeDeleteStepForm();
        }
    };

    // Step???Order?????????
    const openChangeStepOrderButton = useSelector(selectOpenChangeStepOrderButton);
    const changeStepOrder = async() => {
        const result = await dispatch(fetchAsyncChangeStepOrder({"roadmap": roadmap.id, "steps":steps}));
        if(fetchAsyncChangeStepOrder.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncChangeStepOrder.fulfilled.match(result)){
            dispatch(resetOpenChangeStepOrderButton());
        }
    };


    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetSteps(id));
            if(!fetchAsyncGetSteps.fulfilled.match(result)){
                if(result.error.message?.slice(-3)==="401"){
                    navigate("/auth/login");
                }
            }

        };
        func();
    }, [dispatch])

    if(!steps || !roadmap){
        return null
    }

    return (
        <div>
            <div className='steps'>
                <div className="steps__roadmap">
                    <div className="steps__roadmap__header">
                        <Link
                            to={`/prof/${roadmap.user.id}/`}
                            className="steps__roadmap__header__left"
                        > 
                            {/* <div className=''> */}
                                {/* by */}
                                <Avatar
                                    sx={{backgroundColor: "#F98010", width: 35, height: 35}}
                                >
                                    {roadmap.user.name.slice(0, 1)}
                                </Avatar>
                            {/* </div> */}
                        </Link>
                        <div className="steps__roadmap__header__right">
                            <Link 
                                style={{ color: '#000'}}
                                to={`/prof/${roadmap.user.id}/`}
                                className="steps__roadmap__header__right__nick_name"
                            > 
                                {roadmap.user.name}
                            </Link>
                            <div className="steps__roadmap__header__right__dates">
                                {roadmap.created_at!==roadmap.updated_at &&
                                    <div>{roadmap.updated_at}?????????</div>
                                    // :
                                    // <div></div>
                                    // <div>?????????{roadmap.created_at}</div>
                                }
                                <div>{roadmap.created_at}?????????</div>
                            </div>
                        </div>
                    </div>

                    <div className="steps__roadmap__title">
                        {roadmap.title}
                    </div>
                    <div className="steps__roadmap__overview">
                        {roadmap.overview}
                    </div>

                    <DoughnutChart state={stateCounts}/>
                    <Memo selectedStep={selectedStep} loginId={loginId} roadmapUserId={roadmap.user.id}  />
                </div>

                <div className="steps__list">
                    {(roadmap.user.id===loginId && openChangeStepOrderButton===true) &&
                        <div 
                            className="edit_order" 
                            onClick={changeStepOrder}
                        >
                            ?????????????????????
                        </div>
                    }

                    {
                        steps?.map((step, index) => (
                            <div key={index} >
                                {index !== 0 &&
                                    <div className="down_icon">
                                        <ArrowDropDownIcon sx={{ color: 'black' }}/>
                                    </div>
                                }
                                <Step step={step} index={index} loginId={loginId} roadmapUserId={roadmap.user.id} />

                            </div>
                        ))
                    }

                    {roadmap.user.id===loginId &&
                        <>
                            {steps[0]?.id &&
                                <div className="down_icon">
                                    <ArrowDropDownIcon sx={{ color: 'black' }}/>
                                </div>
                            }
                            <div  onClick={openAddStepForm}>
                                <AddStepButton />
                            </div>
                        </>

                    }
                    <AddStepForm roadmapId={id}/>
                    <UpdateStepForm selectedStep={selectedStep} />

                    <Dialog
                        open={openDeleteStepForm}
                        onClose={closeDeleteStepForm}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"??????"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {selectedStep.content}  ????????????????????????
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button 
                            onClick={() => {deleteStep(selectedStep.id);}} 
                            color="primary">
                            ??????
                        </Button>
                        <Button 
                            onClick={closeDeleteStepForm} 
                            color="primary" autoFocus>
                            ?????????
                        </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Steps