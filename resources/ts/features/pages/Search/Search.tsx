import React from 'react';
import SearchForm from '../../components/layout/SearchForm';

const Search: React.FC = () => {
    return (
      <div className="posts_list_container">
          <div className="posts_list_container__header">
            <SearchForm keyword='' section='top' isPost={true}/>
        </div>
      </div>
    )
}

export default Search