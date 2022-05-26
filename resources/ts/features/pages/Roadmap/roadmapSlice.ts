import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import {
  fetchAsyncGetRoadmapsMore,
  fetchAsyncGetRoadmap,
  fetchAsyncGetUserRoadmaps,
  fetchAsyncNewRoadmap,
  fetchAsyncGetFollowingsRoadmaps,
  fetchAsyncGetSearchedRoadmap,
  fetchAsyncGetSearchedRoadmapLatest,
  fetchAsyncUpdateRoadmap,
  fetchAsyncSaveUnsaveRoadmap,
  fetchAsyncGetSavedRoadmaps,
  fetchAsyncGetSteps,
  fetchAsyncNewStep,
  fetchAsyncUpdateStep,
  fetchAsyncUpdateStepMemo,
} from "../Roadmap/roadmapAsyncAction" 


export const roadmapSlice = createSlice({
    name: "roadmap",
    initialState: {
      isLoadingRoadmap: false,
      openRoadmap: false,
      openAddStepForm: false,
      openUpdateStepForm: false,
      openDeleteStepForm: false,
      openEditMemoForm: false,
      openChangeStepOrderButton: false,
      selectedStep:{
        id: "",
        content: "",
        state: "",
        memo: "",
      },
      nextPageLink: "",
      roadmapPerPage: 0,
      countRoadmaps: 0,
      roadmaps: [
          {
            id: "",
            title: "",
            overview: "",
            user: {id: "", name: "", nick_name: ""},
            created_at: "",
            updated_at: "",
            is_public: true,
            is_saved: false,
            count_saves: 0,
          },
      ],
      roadmap: {
        id: "",
        title: "",
        overview: "",
        user: {id: "", name: "", nick_name: ""},
        created_at: "",
        updated_at: "",
        is_public: true,
        is_saved: false,
        count_saves: 0,
      },
      steps:[
        {
          id: "",
          roadmap: "",
          content: "",
          memo: "",
          state: "",
          order: 0,
          createdAt: "",
          updatedAt: "",
        },
      ], 
      stateCounts:{
        todo: 0,
        inProgress: 0,
        done: 0,
      },
      step:{
        id: "",
        roadmap: "",
        content: "",
        memo: "",
        state: "",
        order: 0,
        createdAt: "",
        updatedAt: "",
      },

    },
    reducers:{
      setOpenRoadmap(state) {
        state.openRoadmap = true;
      },
      resetOpenRoadmap(state) {
        state.openRoadmap = false;
      },
      setOpenAddStepForm(state) {
        state.openAddStepForm = true;
      },
      resetOpenAddStepForm(state) {
        state.openAddStepForm = false;
      },
      setOpenUpdateStepForm(state) {
        state.openUpdateStepForm = true;
      },
      resetOpenUpdateStepForm(state) {
        state.openUpdateStepForm = false;
      },
      setOpenDeleteStepForm(state) {
        state.openDeleteStepForm = true;
      },
      resetOpenDeleteStepForm(state) {
        state.openDeleteStepForm = false;
      },
      setOpenEditMemoForm(state) {
        state.openEditMemoForm = true;
      },
      resetOpenEditMemoForm(state) {
        state.openEditMemoForm = false;
      },
      setOpenChangeStepOrderButton(state) {
        state.openChangeStepOrderButton = true;
      },
      resetOpenChangeStepOrderButton(state) {
        state.openChangeStepOrderButton = false;
      },
      fetchPostStart(state) {
          state.isLoadingRoadmap = true;
      },
      fetchPostEnd(state) {
          state.isLoadingRoadmap = false;
      },
      fetchSelecteStep(state, action){
        state.selectedStep.id = action.payload.id;
        state.selectedStep.content = action.payload.content;
        state.selectedStep.state = action.payload.state;
        state.selectedStep.memo = action.payload.memo!==null ? action.payload.memo : "";
      },
      fetchSelectPlusCountRoadmaps(state){
        state.countRoadmaps+=1
      },
      fetchSelectMinusCountRoadmaps(state){
        state.countRoadmaps-=1
      },
      fetchChangeStepOrder(state, action) {
        const index = action.payload;
        if (index !== 0 && index <= state.steps.length-1){
            // 分割代入(1つ前のstepとorderの値を入れ替え)
            [state.steps[index].order, state.steps[index-1].order] = 
            [state.steps[index-1].order, state.steps[index].order];
            // stepsをorderが小さい順に
            state.steps.sort((a, b) => {
                return a.order - b.order;
            });
        }
      },
      fetchStepStateCount(state){
        state.stateCounts.todo = 0;
        state.stateCounts.inProgress = 0;
        state.stateCounts.done = 0;

        state.steps.forEach(step =>{
          if(step.state==="todo"){
            state.stateCounts.todo += 1;
          }
          else if(step.state==="inProgress"){
            state.stateCounts.inProgress += 1;
          }
          else if(step.state==="done"){
            state.stateCounts.done += 1;
          }
        })
      },
      fetchRoadmapDelete(state, action){
        state.countRoadmaps-=1;
        state.roadmaps = state.roadmaps.filter((roadmap)=> roadmap.id !== action.payload);
      },
      fetchStepDelete(state, action){
        state.steps = state.steps.filter((step)=> step.id !== action.payload)
      },
      fetchUpdateRoadmapProf(state, action){
        // Profを編集したときに投稿の投稿者名を変更する処理
        state.roadmaps.map((roadmap) =>
            roadmap.user.nick_name = 
              roadmap.user.id === action.payload.postedBy 
                ? action.payload.nick_name 
                : roadmap.user.nick_name,
        );
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchAsyncGetRoadmapsMore.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: [...state.roadmaps, ...action.payload.data],
        };
      });
      builder.addCase(fetchAsyncGetRoadmap.fulfilled, (state, action) => {

        return {
          ...state,
          roadmap: action.payload.roadmap,
          steps: action.payload.roadmap.steps,
        };
      });
      builder.addCase(fetchAsyncGetUserRoadmaps.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: action.payload.data,
        };
      });
      builder.addCase(fetchAsyncGetSavedRoadmaps.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: action.payload.data,
        };
      });
      builder.addCase(fetchAsyncGetSearchedRoadmap.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: action.payload.data,
        };
      });
      builder.addCase(fetchAsyncGetSearchedRoadmapLatest.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: action.payload.data,
        };
      });
      builder.addCase(fetchAsyncGetFollowingsRoadmaps.fulfilled, (state, action) => {
        return {
          ...state,
          nextPageLink: action.payload.next_page_link,
          roadmaps: action.payload.data,
        };
      });
      builder.addCase(fetchAsyncNewRoadmap.fulfilled, (state, action) => {
        return {
          ...state,
          roadmaps: [...state.roadmaps, action.payload],
        };
      });
      builder.addCase(fetchAsyncUpdateRoadmap.fulfilled, (state, action) => {
        state.roadmaps.map((roadmap) => {
          roadmap.is_public = roadmap.id === action.payload.roadmap.id ? action.payload.roadmap.is_public : roadmap.is_public
          roadmap.title =  roadmap.id === action.payload.roadmap.id ? action.payload.roadmap.title : roadmap.title
          roadmap.overview =  roadmap.id === action.payload.roadmap.id  ? action.payload.roadmap.overview : roadmap.overview
        }
        );
      });
      builder.addCase(fetchAsyncSaveUnsaveRoadmap.fulfilled, (state, action) => {
        if(action.payload.result==='save'){
          // postのstateの変更
          state.roadmap.count_saves = action.payload.count_saves
          state.roadmap.is_saved = true
          // postsのstateの変更
          const add_save = (roadmap:any) => {
            // 投稿のいいね数といいねをしたかどうかを変更
            roadmap["count_saves"] = action.payload.count_saves
            roadmap["is_saved"] = true;
            return roadmap;
          }
          state.roadmaps = state.roadmaps.map((roadmap) =>
            roadmap.id === action.payload.id ? add_save(roadmap) : roadmap,
         );
        }
        else if(action.payload.result==='unsave'){
          state.roadmap.count_saves = action.payload.count_saves
          state.roadmap.is_saved = false
          // postsのstateの変更
          const delete_save = (roadmap:any) => {
            // 投稿のいいね数といいねをしたかどうかを変更
            roadmap["count_saves"] = action.payload.count_saves
            roadmap["is_saved"] = false;
            return roadmap;
          }
          state.roadmaps = state.roadmaps.map((roadmap) =>
            roadmap.id === action.payload.id ? delete_save(roadmap) : roadmap,
         );
        }
      });
      builder.addCase(fetchAsyncGetSteps.fulfilled, (state, action) => {
        state.roadmap= action.payload.roadmap;
        state.steps= action.payload.roadmap.steps;
        state.stateCounts.done = 0;
        state.stateCounts.inProgress = 0;
        state.stateCounts.todo = 0;

        state.steps.forEach(step =>{
            if(step.state==="todo"){
              state.stateCounts.todo += 1
            }
            else if(step.state==="inProgress"){
              state.stateCounts.inProgress += 1
            }
            else if(step.state==="done"){
              state.stateCounts.done += 1
            }
        })
      });
      builder.addCase(fetchAsyncNewStep.fulfilled, (state, action) => {
        state.steps =  [...state.steps, {
          id: action.payload.step.id,
          roadmap: action.payload.step.roadmap_id,
          content: action.payload.step.content,
          memo: "",
          state: action.payload.step.state,
          order: action.payload.step.order,
          createdAt: action.payload.step.created_at,
          updatedAt: action.payload.step.updated_at
        }]
        // return {
        //   ...state,
        //   steps: [...state.steps, action.payload.step],
        // };
      });
      builder.addCase(fetchAsyncUpdateStep.fulfilled, (state, action) => {
        state.steps = state.steps.map((step) =>
          step.id === action.payload.step.id ? action.payload.step: step
        );
      });

      builder.addCase(fetchAsyncUpdateStepMemo.fulfilled, (state, action) => {
        state.steps = state.steps.map((step) =>
          step.id === action.payload.step.id ? action.payload.step: step
        );
      });
    }
});

export const {
  setOpenRoadmap,
  resetOpenRoadmap,
  setOpenAddStepForm,
  resetOpenAddStepForm,
  setOpenUpdateStepForm,
  resetOpenUpdateStepForm,
  setOpenDeleteStepForm,
  resetOpenDeleteStepForm,
  setOpenEditMemoForm,
  resetOpenEditMemoForm,
  setOpenChangeStepOrderButton,
  resetOpenChangeStepOrderButton,
  fetchSelectPlusCountRoadmaps,
  fetchSelectMinusCountRoadmaps,
  fetchPostEnd,
  fetchPostStart,
  fetchSelecteStep,
  fetchChangeStepOrder,
  fetchStepStateCount,
  fetchRoadmapDelete,
  fetchStepDelete,
  fetchUpdateRoadmapProf
} = roadmapSlice.actions;

export const selectIsLoadingRoadmap = (state: RootState) =>  state.roadmap.isLoadingRoadmap;
export const selectOpenRoadmap = (state: RootState) => state.roadmap.openRoadmap;
export const selectOpenAddStepForm = (state: RootState) => state.roadmap.openAddStepForm;
export const selectOpenUpdateStepForm = (state: RootState) => state.roadmap.openUpdateStepForm;
export const selectOpenDeleteStepForm = (state: RootState) => state.roadmap.openDeleteStepForm;
export const selectOpenChangeStepOrderButton = (state: RootState) => state.roadmap.openChangeStepOrderButton;
export const selectOpenEditMemoForm = (state: RootState) => state.roadmap.openEditMemoForm;
export const selectNextPageLink = (state: RootState) => state.roadmap.nextPageLink;

export const selectRoadmapPerPage = (state: RootState) => state.roadmap.roadmapPerPage;
export const selectCountRoadmaps = (state: RootState) => state.roadmap.countRoadmaps;

// export const selectRoadmapPagenation = (state: RootState) => state.roadmap.roadmapPagenation;
export const selectselectedStep = (state: RootState) => state.roadmap.selectedStep;
export const selectRoadmaps = (state: RootState) => state.roadmap.roadmaps;
export const selectRoadmap = (state: RootState) => state.roadmap.roadmap;
export const selectSteps = (state: RootState) => state.roadmap.steps;
export const selectStateCounts = (state: RootState) => state.roadmap.stateCounts;
export const selectStep = (state: RootState) => state.roadmap.step;

export default roadmapSlice.reducer;