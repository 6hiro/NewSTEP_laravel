import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { 
    TextField, 
    Button, 
    CircularProgress,
    FormControl, 
    Select 
} from "@mui/material";

import { AppDispatch } from "../../../app/store";
import { 
    selectIsLoadingRoadmap,
    fetchPostStart,
    fetchPostEnd,
} from './roadmapSlice';
import {
    fetchAsyncNewRoadmap,
} from  '../../pages/Roadmap/roadmapAsyncAction';
import {
  selectMyUser,
} from '../Auth/authSlice';

const AddRoadmapForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
    const user = useSelector(selectMyUser);

    return (
        <Formik
          initialErrors={{ title: "required" }}

          initialValues={{
            title: "",
            overview: "",
            isPublic: "private",
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const data = {
                title: values.title,
                overview: values.overview,
                is_public: values.isPublic==='public' ? true : false,

            }
            const result = await dispatch(fetchAsyncNewRoadmap(data));
            if(fetchAsyncNewRoadmap.rejected.match(result)){
              if(result.error.message?.slice(-3)==="401"){
                navigate("/auth/login");
              }
            }else if (fetchAsyncNewRoadmap.fulfilled.match(result)) {
              dispatch(fetchPostEnd());
              // navigate("/")
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
            <div className="add_roadmap">
              <h1 className="title">ロードマップ</h1>
              <div className="post_progress">
                    {isLoadingRoadmap && <CircularProgress />}
              </div>
              <form className="add_post" onSubmit={handleSubmit}>
                <div>
                  <TextField
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="タイトル(60字以内)"
                    // style={{ marginTop: 10 }}
                    fullWidth
                    // multiline
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
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="概要(250字以内)"
                    style={{ marginTop: 30 }}
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
                  {/* <br /> */}
                  
                  <div className="post_button">
                    <FormControl>
                      <Select
                        native
                        style={{ marginTop: 30 }}
                        value={values.isPublic}
                        onChange={(e) => handleChange(e)}
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
                      <p>入力できる文字数は、タイトルが60字、概要が250字です。</p>
                    </div>
                    <br /> */}
                    <Button
                    //   variant="contained"
                      variant="outlined"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                      size="large"
                    >
                      作成  
                    </Button >                    
                  </div>
                </div>
              </form>
            </div>
          )}
        </Formik>
    )
}

export default AddRoadmapForm