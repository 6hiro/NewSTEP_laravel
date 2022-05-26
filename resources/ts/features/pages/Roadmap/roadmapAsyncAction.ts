import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { 
  PROPS_NEW_ROADMAP, 
  PROPS_UPDATE_ROADMAP, 
  PROPS_NEW_STEP,
  PROPS_CHANGE_STEP_ORDER, 
  PROPS_UPDATE_STEP, 
  PROPS_UPDATE_STEP_MEMO
} from "../../types";


export const fetchAsyncGetRoadmapsMore = createAsyncThunk("roadmapMore/get", async (link: string) => {
    // path?skip=
    const res = await axios.get(link);
    return res.data;
  });
  export const fetchAsyncGetRoadmap = createAsyncThunk("roadmap/get", async (roadmapId: string | undefined) => {
    const res = await axios.get(`/api/roadmap/${roadmapId}`);
    return res.data
  })
  export const fetchAsyncGetUserRoadmaps = createAsyncThunk("ownroadmaps/get", async (userId: string | undefined) => {
    const res = await axios.get(`/api/roadmap/user/${userId}`);
    return res.data;
  });
  export const fetchAsyncNewRoadmap = createAsyncThunk(
    "roadmap/post", 
    async (newRoadmap: PROPS_NEW_ROADMAP) => {
      const res = await axios.post(`/api/roadmap`, newRoadmap,);
      return res.data;
  });
  export const fetchAsyncGetFollowingsRoadmaps = createAsyncThunk(
    "followingsRoadmaps/get",
    async () => {
      const res = await axios.get(`/api/followings/roadmap`);
      return res.data;
    }
  );
  export const fetchAsyncGetSearchedRoadmap = createAsyncThunk("searchRoadmaps/get", async (word: string) => {
      const res = await axios.get(`/api/roadmap/search/${word}/`);
      return res.data;
  });
  export const fetchAsyncGetSearchedRoadmapLatest = createAsyncThunk("searchRoadmapsLatest/get", async (word: string) => {
    const res = await axios.get(`/api/roadmap/search/${word}/latest`);
    return res.data;
  })
  export const fetchAsyncUpdateRoadmap = createAsyncThunk(
    "roadmap/patch", 
    async (updateRoadmap: PROPS_UPDATE_ROADMAP) => {
      const res = await axios.patch(`/api/roadmap/${updateRoadmap.roadmap}`, updateRoadmap);
      return res.data;
    }
  );
  export const fetchAsyncDeleteRoadmap = createAsyncThunk("roadmapDelete/delete", async (id: string | undefined) => {
    const  res  = await axios.delete(`/api/roadmap/${id}`);
    return res.data;
  });
  export const fetchAsyncSaveUnsaveRoadmap = createAsyncThunk(
    "save/put",
    async (roadmapId: string) => {
      const res = await axios.put(`/api/roadmap/${roadmapId}/save`,{});
      return res.data;
    }
  );
  export const fetchAsyncGetSavedRoadmaps = createAsyncThunk(
    "savedRoadmaps/get",
    async (userId: string | undefined) => {
      const res = await axios.get(`/api/roadmap/user/${userId}/save`);
      return res.data;
    }
  );
  export const fetchAsyncGetSteps = createAsyncThunk("steps/get", async(roadmapId: string | undefined) =>{
    const res = await axios.get(`/api/step/roadmap/${roadmapId}`);
    return res.data
  })
  export const fetchAsyncNewStep = createAsyncThunk("step/post", async (newStep: PROPS_NEW_STEP) => {
    const res = await axios.post(`/api/step/`, newStep);
    return res.data;
  });
  export const fetchAsyncUpdateStep = createAsyncThunk(
    "step/patch", 
    async (updateStep: PROPS_UPDATE_STEP) => {
      const uploadData = {
        content: updateStep.content,
        state: updateStep.state
      }
      const res = await axios.patch(`/api/step/${updateStep.step}`, uploadData);
      return res.data;
    }
  );
  export const fetchAsyncUpdateStepMemo = createAsyncThunk(
    "stepMemo/patch", 
    async (updateStep: PROPS_UPDATE_STEP_MEMO) => {
      const uploadData = {
        memo: updateStep.memo,
      }
      const res = await axios.patch(`/api/step/memo/${updateStep.step}`, uploadData);
      return res.data;
    }
  );
  export const fetchAsyncDeleteStep = createAsyncThunk("stepDelete/delete", async (id: string) => {
    const  res  = await axios.delete(`/api/step/${id}`);
    return res.data;
  });
  export const fetchAsyncChangeStepOrder = createAsyncThunk("editstep/post", async (editStep: PROPS_CHANGE_STEP_ORDER) => {
    const res = await axios.post(`/api/change-order`, editStep);
    return res.data;
  });