// javascript でデータ型が定義されている
export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}
/*authSlice.ts*/
export interface PROPS_REGISTER {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}
export interface PROPS_FORGOT {
  email: string;
}
export interface PROPS_RESET {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
export interface PROPS_REFRESHTOKEN {
  refresh: string;
}

export interface PROPS_PROFILE {
  id: string;
  nickName: string;
  user:string ;
  img: File | null;
  followers: string[];
  following: string[];
}
export interface PROPS_UPDATE_PROFILE {
  nickName: string;
  img: File | null;
  id: string ;
}
export interface PROPS_NICKNAME {
  nickName: string;
}
export interface PROPS_FOLLOWED {
  id: string;
  nickName: string;
  // user:string ;
  img: File | null;
  following: string[];
  current: string[];
  new: string;
}

/*postSlice.ts*/
// export interface PROPS_NEWPOST {
//   title: string;
//   img: File | null;
// }
export interface PROPS_NEWPOST {
  post: string;
}
export interface PROPS_LIKED {
  id: string;
  post: string;
  isPublic: string,
  current: string[];
  new: string;
}
export interface PROPS_POST {
  postId: string;
  loginId: string;
  postedBy: string;
  post: string;
  isPublic: string;
  liked: string[];
}
export interface PROPS_COMMENT {
  content: string;
  post_id: string | undefined;
}
export interface PROPS_NEW_ROADMAP {
  // challenger: string;
  title: string;
  overview: string;
  is_public: boolean;
}
export interface PROPS_UPDATE_ROADMAP {
  roadmap: string;
  title: string;
  overview: string;
  is_public: boolean;
}
export interface PROPS_NEW_STEP{
  roadmap: string| undefined;
  content: string;
  state: string;
  // order: number;
}
export interface PROPS_UPDATE_STEP_MEMO{
  step: string;
  memo: string;
}
export interface PROPS_UPDATE_STEP{
  step: string;
  content: string;
  state: string;
}
export interface PROPS_CHANGE_STEP_ORDER {
  roadmap:string;
  steps: {
    id: string;
    roadmap: string;
    content: string;
    state: string;
    order: number;
 }[]
}