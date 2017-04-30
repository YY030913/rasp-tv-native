import React, { Component } from 'react';
import List from './list';
import NavButton from './navButton';

export default class SeasonsList extends Component {
    renderSeasonRow = (season) => {
        const { location, match } = this.props;
        const title = `Season ${season}`;
        const route = {
            pathname: `/shows/${match.params.showId}/seasons/${season}/episodes`,
            state: {
                episodes: location.state.episodes
            }
        };

        return <NavButton text={title} to={route} />;
    }
    getSeasons = () => {
        const episodes = this.props.location.state.episodes;
        const seasons = [];
        for (let e of episodes) {
            if (seasons.indexOf(e.season) === -1) {
                seasons.push(e.season);
            }
        }

        return seasons.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    }
    playRandomEpisode = () => {
        const { location, history } = this.props;
        const episodes = location.state.episodes;
        const randomIndex = Math.floor(Math.random() * episodes.length);
        const episodeId = episodes[randomIndex].id;
        history.push(`/episodes/${episodeId}/play`);
    }
    render() {
        return (
            <List
                items={this.getSeasons()}
                renderRow={this.renderSeasonRow}
                onRandomBtnPress={this.playRandomEpisode}
            />
        );
    }
}
