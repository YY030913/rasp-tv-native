import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';
import Routes from '../routes';

const ShowsList = ({ isLoading, shows, getShows, navigator, selectTab, selectEpisode }) => {
    return (
        <FilterableList
            hasChangedKey="id"
            items={shows}
            filterByKey="title"
            isLoading={isLoading}
            renderRow={show => {
                const route = {
                    ...Routes.seasons,
                    passProps: {
                        episodes: show.episodes,
                        selectTab: selectTab,
                        selectEpisode: selectEpisode
                    }
                };
                return <NavButton text={show.title} onPress={() => navigator.push(route)} />;
            }}
            onRefresh={() => getShows(true)}
        />
    );
};

export default ShowsList;
