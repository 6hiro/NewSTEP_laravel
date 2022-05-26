import React, { useEffect, useState } from 'react'
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { fetchPostEnd, fetchPostStart, resetOpenEditMemoForm, selectOpenEditMemoForm } from '../../pages/Roadmap/roadmapSlice';
import {
fetchAsyncUpdateStepMemo
} from  '../../pages/Roadmap/roadmapAsyncAction';
import { AppDispatch } from '../../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const customStyles = {
    overlay: {
        backgroundColor: "rgba(1, 111, 233, 0.5)",
        // backdropFilter: "blur(5px)",
        zIndex: 200,
    },
    content: {
        top: "50%",
        left: "50%",
        width: "95%",
        height: "90%",
        padding: "5px",
        transform: "translate(-50%, -50%)",
    },
};

const Memo: React.FC<{ 
    selectedStep:{id: string; memo: string; content: string;}, 
    loginId: string; 
    roadmapUserId:string,
}> = (props) => {
    Modal.setAppElement("#app");
    const dispatch: AppDispatch = useDispatch();
    const openEditMemoForm = useSelector(selectOpenEditMemoForm)
    let navigate = useNavigate();

    const [markdown, setMarkdown] = useState("");

    const updateStepMemo = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { step: props.selectedStep.id, memo: markdown}
        dispatch(fetchPostStart());1
        const result = await dispatch(fetchAsyncUpdateStepMemo(packet));
        if(fetchAsyncUpdateStepMemo.rejected.match(result)){
            if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
            }
        }else if(fetchAsyncUpdateStepMemo.fulfilled.match(result)){
          dispatch(fetchPostEnd());
          dispatch(resetOpenEditMemoForm());
        }
    };

    useEffect(() => {
        setMarkdown(props.selectedStep.memo);
    }, [props.selectedStep]);

  return (
    <Modal
        isOpen={openEditMemoForm}
        onRequestClose={() => {
            dispatch(resetOpenEditMemoForm());
        }}
        style={customStyles}
    >
        <div className="memo">
            {props.roadmapUserId===props.loginId &&
                <div className="add_step_form__input__submit">
                    <button
                        disabled={!markdown.length}
                        type="submit"
                        className="add_step_form__input__submit__button"
                        onClick={updateStepMemo}
                    >
                        変更
                </button>
                </div>
            }

            <div className="step_content">{props.selectedStep.content}</div>

            {props.roadmapUserId===props.loginId &&
                <div className="memo__edit">
                    <textarea
                        id="body"
                        placeholder="Write your note here..."
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                    />
                </div>
            }
            {markdown &&
                <div className="memo__preview">
                    <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
                </div>
            }

        </div>

    </Modal>
  )
}

export default Memo