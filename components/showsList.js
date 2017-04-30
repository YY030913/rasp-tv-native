import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';

const ShowsList = ({ isLoading, shows, getShows }) => {
    return (
        <FilterableList
            hasChangedKey="id"
            items={shows}
            filterByKey="title"
            isLoading={isLoading}
            renderRow={show => {
                const route = {
                    pathname: `/shows/${show.id}/seasons`,
                    state: {
                        episodes: show.episodes
                    }
                };
                return <NavButton text={show.title} to={route} />;
            }}
            onRefresh={getShows}
        />
    );
};

export default ShowsList;
