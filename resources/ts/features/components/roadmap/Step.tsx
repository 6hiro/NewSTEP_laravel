import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../app/store';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import NoteIcon from '@mui/icons-material/Note';
import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import BatteryCharging50Icon from '@mui/icons-material/BatteryCharging50';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { 
    fetchSelecteStep, 
    setOpenUpdateStepForm,
    setOpenDeleteStepForm,
    setOpenChangeStepOrderButton,
    fetchChangeStepOrder,
    setOpenEditMemoForm
} from '../../pages/Roadmap/roadmapSlice';

const Step: React.FC<{
    step:{
        id: string;
        roadmap: string,
        content: string,
        state: string,
        memo: string,
        order: number,
    },
    index: number,
    loginId: string,
    roadmapUserId:string,
}> = (props) => {
    const dispatch: AppDispatch = useDispatch();

    const openUpdateStepForm = ((step :{
        id: string;
        content: string;
        state: string;
        memo: string;
    }) => {
        dispatch(fetchSelecteStep(step));
        dispatch(setOpenUpdateStepForm())
    })
    const openDeleteStepForm = (step :{
        id: string;
        content: string;
        state: string;
        memo: string;
    }) => {
        dispatch(fetchSelecteStep(step));
        dispatch(setOpenDeleteStepForm())

    }
    const openEditMemoForm = (step :{
        id: string;
        content: string;
        state: string;
        memo: string;
    }) => {
        dispatch(fetchSelecteStep(step));
        dispatch(setOpenEditMemoForm())
    }
  return (
    <div className="step">
        <div className="step__header">
            <div className="step__header__order">
                {/* {props.index+1} */}
            </div>
            <div className="step__header__state">
                {props.step.state==="todo" &&
                    <div className="toDo"><Battery0BarIcon/></div>
                }
                {props.step.state==="inProgress" &&

                    <div className="inProgress"><BatteryCharging50Icon/></div>
                }
                {props.step.state=="done" &&
                    <div className="done"><BatteryChargingFullIcon/></div>
                }
            </div>
        </div>

        <div className="step__content">
            {props.step.content}
        </div>


        <div className="step__aditional_elements">
            {props.roadmapUserId===props.loginId ?
                <>
                    {props.index!==0 ?
                        <IconButton 
                            aria-label="changeOrder"
                            onClick={() => {
                                dispatch(fetchChangeStepOrder(props.index));
                                // handleClickOpenChangeStepOrder();
                                dispatch(setOpenChangeStepOrderButton())
                            }}
                        >
                            <ArrowUpwardIcon fontSize="small"/>
                        </IconButton>
                        :
                        <div className="space"></div>
                    }

                    <IconButton 
                        aria-label="delete" 
                        onClick={() => {
                            openDeleteStepForm({
                                id: props.step.id,
                                content: props.step.content,
                                state: props.step.state,
                            memo: props.step.memo,
                            });
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        aria-label="update" 
                        onClick={() => openUpdateStepForm({
                            id: props.step.id,
                            content: props.step.content,
                            state: props.step.state,
                            memo: props.step.memo,
                        })}
                    >
                        <CreateIcon fontSize="small" />
                    </IconButton>
                </>
                :
                <>
                    <div className="space"></div>
                </>
            }
            <IconButton 
                aria-label="note"
                onClick={() => openEditMemoForm({
                    id: props.step.id,
                    content: props.step.content,
                    state: props.step.state,
                    memo: props.step.memo,
                })}
            >
                <NoteIcon fontSize="small" />
            </IconButton>
        </div>
    </div>
  )
}

export default Step