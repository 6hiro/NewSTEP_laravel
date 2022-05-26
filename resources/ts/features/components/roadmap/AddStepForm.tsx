import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { 
    CircularProgress, 
} from "@mui/material";

import { AppDispatch } from "../../../app/store";
import { 
    selectIsLoadingRoadmap,
    selectOpenAddStepForm,
    resetOpenAddStepForm,
    fetchPostStart,
    fetchPostEnd,
    fetchStepStateCount,
} from '../../pages/Roadmap/roadmapSlice';
import {
    fetchAsyncNewStep,
} from  '../../pages/Roadmap/roadmapAsyncAction';
const customStyles = {
    overlay: {
        backgroundColor: "rgba(1, 111, 233, 0.5)",
        // backdropFilter: "blur(5px)",
        zIndex: 100,
    },
    content: {
        top: "50%",
        left: "50%",
        width: "90%",
        height: 380,
        padding: "5px",
        transform: "translate(-50%, -50%)",
    },
};

const AddStepForm: React.FC<{ roadmapId: string | undefined; }> = (props) => {
    Modal.setAppElement("#app");

    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);

    const openAddStepForm = useSelector(selectOpenAddStepForm);
    
    // 追加するstep
    const [content, setContent] = useState("");
    const [state, setState] = useState("todo");

    const addStep = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { content: content, state: state, roadmap: props.roadmapId };
        
        dispatch(fetchPostStart());
        const result = await dispatch(fetchAsyncNewStep(packet));
        if(fetchAsyncNewStep.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncNewStep.fulfilled.match(result)){
          dispatch(fetchPostEnd());
          setContent("");;
          setState("todo")
          dispatch(fetchStepStateCount());
          dispatch(resetOpenAddStepForm());
        }
    };

    return (
        <Modal
            isOpen={openAddStepForm}
            onRequestClose={() => {
             dispatch(resetOpenAddStepForm());
            }}
            style={customStyles}
        >
            <div className="add_step_form">
                {/* <div className="add_step_form__title">
                    Stepの追加
                </div> */}
                <div className="add_step_form__progress">
                    {isLoadingRoadmap && <CircularProgress />}
                </div>

                <form className="add_step_form__input">
                    <div className="add_step_form__input__content">
                        <textarea 
                            className=""
                            rows={8}
                            // cols={45}
                            minLength={1}
                            maxLength={100}
                            // placeholder="テキスト(100文字以内)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <span>テキスト(100文字以内)</span>
                    </div>

                    <div className="add_step_form__input__state">
                        {/* {state} */}
                        <input type="radio" name="state" id="dot-1" checked={state==="todo"} onChange={() => setState("todo")} />
                        <input type="radio" name="state" id="dot-2" checked={state==="inProgress"} onChange={() => setState("inProgress")}/>
                        <input type="radio" name="state" id="dot-3" checked={state==="done"} onChange={() => setState("done")}/>

                        <label htmlFor="dot-1">
                            <span className={`dot ${state==="todo" && "checked"}`}></span>
                            <span className="add_step_form__input__state_todo">未着手</span>
                        </label>
                        <label htmlFor="dot-2">
                            <span className={`dot ${state==="inProgress" && "checked"}`}></span>
                            <span className="add_step_form__input__state_in_progress">取組中</span>
                        </label>
                        <label htmlFor="dot-3">
                            <span className={`dot ${state==="done" && "checked"}`}></span>
                            <span className="add_step_form__input__state_done">完了</span>
                        </label>
                    </div>

                    <div className="add_step_form__input__submit">
                        <button
                            disabled={!content.length}
                            type="submit"
                            className="add_step_form__input__submit__button"
                            onClick={addStep}
                        >
                            追加
                        </button>
                    </div>
                </form>
                    
            </div>
        </Modal>

    )
}

export default AddStepForm