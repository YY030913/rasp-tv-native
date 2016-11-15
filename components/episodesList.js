import React, { Component } from 'react';
import List from './list';
import NavButton from './navButton';
import { TabIds } from '../constants';

export default class EpisodesList extends Component {
    constructor(props) {
        super(props);

        this.renderEpisodeRow = this.renderEpisodeRow.bind(this);
        this.playRandomEpisode = this.playRandomEpisode.bind(this);
    }
    renderEpisodeRow(episode) {
        const playAndSwitchTab = () => {
            this.props.selectEpisode(episode.id);
            this.props.selectTab(TabIds.NOW_PLAYING_TAB);
        };

        return <NavButton text={`${episode.number} - ${episode.title}`} onPress={playAndSwitchTab} />;
    }
    playRandomEpisode() {
        const { episodes, selectTab, selectEpisode } = this.props;
        const randomIndex = Math.floor(Math.random() * episodes.length);
        selectEpisode(episodes[randomIndex].id);
        selectTab(TabIds.NOW_PLAYING_TAB);
    }
    render() {
        const { episodes } = this.props;
        return (
            <List
                hasChangedKey="id"
                items={episodes}
                filterByKey="title"
                renderRow={this.renderEpisodeRow}
                onRandomBtnPress={this.playRandomEpisode}
            />
        );
    }
}
