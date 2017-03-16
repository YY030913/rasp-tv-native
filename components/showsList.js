import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';

const ShowsList = ({ isLoading, shows, getShows, selectEpisode }) => {
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
                        episodes: show.episodes,
                        selectEpisode: selectEpisode
                    }
                };
                return <NavButton text={show.title} to={route} />;
            }}
            onRefresh={() => getShows(true)}
        />
    );
};

export default ShowsList;
