import React, { Component } from 'react';
import List from './list';
import NavButton from './navButton';

function filterEpisodes(episodes, season) {
    return episodes
        .filter(e => e.season === parseInt(season))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

export default class EpisodesList extends Component {
    constructor(props) {
        super(props);

        this.state = { filteredEpisodes: filterEpisodes(props.location.state.episodes, props.match.params.season)};
    }
    componentWillReceiveProps(newProps) {
        if (this.props.match.params.season !== newProps.match.params.season) {
            this.setState({ filteredEpisodes: filterEpisodes(newProps.location.state.episodes, newProps.match.params.season) });
        }
    }
    renderEpisodeRow = (episode) => {
        const { location } = this.props;
        const path = `/episodes/${episode.id}/play`;
        return (
            <NavButton
                to={path}
                text={`${episode.number} - ${episode.title}`}
                onPress={() => location.state.selectEpisode(episode.id)}
            />
        );
    }
    playRandomEpisode = (episodes) => {
        const { location } = this.props;
        const randomIndex = Math.floor(Math.random() * episodes.length);
        location.state.selectEpisode(episodes[randomIndex].id);
    }
    render() {
        return (
            <List
                hasChangedKey="id"
                items={this.state.filteredEpisodes}
                filterByKey="title"
                renderRow={this.renderEpisodeRow}
                onRandomBtnPress={this.playRandomEpisode}
            />
        );
    }
}
