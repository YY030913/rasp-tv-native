import React from 'react';
import List from './list';

const FilterableList = (props) => {
    return <List {...props} showSearchBar />;
};

export default FilterableList;
