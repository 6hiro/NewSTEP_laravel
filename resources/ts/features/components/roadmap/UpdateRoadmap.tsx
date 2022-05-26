import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { 
    TextField, 
    Button, 
    CircularProgress, 
    FormControl, 
    Select 
} from "@mui/material";

import { AppDispatch } from '../../../app/store';
import {
    resetOpenRoadmap,
    fetchPostEnd,
    fetchPostStart,
    selectOpenRoadmap,
    selectIsLoadingRoadmap,

}from '../../pages/Roadmap/roadmapSlice';
import {
    fetchAsyncUpdateRoadmap,
} from  '../../pages/Roadmap/roadmapAsyncAction';

// moduleのstyleを定義
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
    height: "80%",
    padding: "5px",
    transform: "translate(-50%, -50%)",
  },
};


const UpdateRoadmap: React.FC<{ roadmapId: string; title: string; overview: string; isPublic: boolean;}> = (props) => {
  Modal.setAppElement("#app");
  let navigate = useNavigate();
  const openRoadmap = useSelector(selectOpenRoadmap);
  const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={openRoadmap}
        onRequestClose={async () => {
          await dispatch(resetOpenRoadmap());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ title: "required" }}

          initialValues={{
            roadmap: props.roadmapId,
            title: props.title,
            overview: props.overview,
            // isPublic: props.isPublic,
            isPublic: props.isPublic ? "public" : "private",
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const data = {
                roadmap: values.roadmap,
                title: values.title,
                overview: values.overview,
                is_public: values.isPublic==='public' ? true : false,
            }
            const result = await dispatch(fetchAsyncUpdateRoadmap(data));
            if (fetchAsyncUpdateRoadmap.rejected.match(result)) {
              if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
              }
            }else if (fetchAsyncUpdateRoadmap.fulfilled.match(result)) {
              dispatch(fetchPostEnd());
              dispatch(resetOpenRoadmap());
            }
          }}
          validationSchema={
            Yup.object().shape({
              title: Yup.string()
                .required("この項目は必須です。")
                .max(60, "60文字以内で入力してください。"),
              overview: Yup.string()
                .required("この項目は必須です。")
                .max(250, "250文字以内で入力してください。"),
              isPublic: Yup.string()
                .required("この項目は必須です。"),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div className='update_form'>
              <div className="post_progress">
                    {isLoadingRoadmap && <CircularProgress />}
              </div>
              <form className="add_post" onSubmit={handleSubmit}>
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="タイトル(60字以内)"
                    // style={{ margin: 10 }}
                    fullWidth
                    variant="outlined"
                    type="input"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {touched.title && errors.title ? (
                    <div className="post_error">{errors.title}</div>
                  ) : null}
                  <br />

                  <TextField
                    id="outlined-textarea"
                    label="概要(250字以内)"
                    style={{ marginTop: 40 }}
                    fullWidth
                    multiline
                    variant="outlined"
                    type="input"
                    name="overview"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.overview}
                  />
                  {touched.overview && errors.overview ? (
                    <div className="post_error">{errors.overview}</div>
                  ) : null}
                  <br />
                  
                  <div className="post_button">
                    <FormControl>
                      <Select
                        native
                        style={{ marginTop: 20 }}
                        value={values.isPublic}
                        onChange={handleChange}
                        inputProps={{
                          name: 'isPublic',
                          id: 'age-native-simple',
                        }}
                      >
                        <option value={"public"}>公開</option>
                        <option value={"private"}>非公開</option>
                      </Select>
                    </FormControl>
                    {touched.isPublic && errors.isPublic ? (
                      <div className="post_error">{errors.isPublic}</div>
                    ) : null}
                    <br />
                    <br />
                    {/* <div className="notes">
                      <p>入力できる文字数は、タイトルが60字、 概要が250字です。</p>
                    </div> */}
                    <Button
                      variant="outlined"
                      color="primary"
                    //   disabled={!isValid}
                      type="submit"
                    >
                      更新
                    </Button >                    
                  </div>
                </div>
              </form>
            </div>
          )}
        </Formik>       
      </Modal>
    </>
  );
};

export default UpdateRoadmap;