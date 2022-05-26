import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../app/store';
    
const SearchForm:React.FC<{keyword:string, section: string, isPost: boolean}> = (props) => {
        let navigate = useNavigate();
        const dispatch: AppDispatch = useDispatch();

        const [keyword, setKeyword] = useState(String(props.keyword));
        const [section, setSection] = useState(String(props.section));
        const [isPosts, setIsPosts] = useState<boolean>(props.isPost);

        useEffect(() => {
        }, [dispatch, isPosts])

      return (
        <div
            className="roadmap__search"
        >
            {/* Search Form */}
            <form action="" 
                className="roadmap__search__form"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        if(keyword.length>0){
                            // setSection("top")
                            // navigate(`/search/roadmap/${keyword}/`);
                            if(section==="top" && isPosts){
                                navigate(`/search/post?q=${keyword}&section=top`);
                            }else if(section==="latest" && isPosts){
                                navigate(`/search/post?q=${keyword}&section=latest`);
                            }else if(section==="top" && !isPosts){
                                navigate(`/search/roadmap?q=${keyword}&section=top`);
                            }else if(section==="latest" && !isPosts){
                                navigate(`/search/roadmap?q=${keyword}&section=latest`);
                            }
                        }
                    }
                }
            >
                <input 
                    type="text" 
                    placeholder='キーワード検索'
                    className='roadmap__search__form__input'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className='button'>
                    <i className='bx bx-search'></i>
                </button>
            </form>
            <div className="roadmap__search__state">
                    {/* {state} */}
                    <input 
                        type="radio" name="state" id="dot-1" 
                        checked={section==="top"} 
                        onChange={() => setSection("top")} 
                    />
                    <input 
                        type="radio" name="state" id="dot-2" 
                        checked={section==="latest"} 
                        onChange={() => setSection("latest")}
                    />

                    <label 
                        htmlFor="dot-1"
                        onClick={()=>setSection("top")}
                    >
                        <span className={`dot ${section==="top" ? "checked" : ""}`}></span>
                        <span className="aroadmap__search__state_top">トップ</span>
                    </label>
                    <label 
                        htmlFor="dot-2"
                        onClick={()=>setSection("latest")}
                    >
                        <span className={`dot ${section==="latest" ? "checked" : ""}`}></span>
                        <span className="roadmap__search__state_latest">最近</span>
                    </label>
            </div>
            <div className="navigation">
                <div
                    className={`section ${isPosts ? "active" : ""}`}
                    onClick={() => {
                        setIsPosts(true);
                        // navigate(`/search/post/${props.keyword}/`);
                    }}
                >
                つぶやき
                </div>
                <div
                    className={`section ${!isPosts ? "active" : ""}`}
                    onClick={async() => {
                        setIsPosts(false);                        
                    }}
                >
                    ロードマップ
                </div>
                
            </div>

        </div>
      )
    }
    
    export default SearchForm