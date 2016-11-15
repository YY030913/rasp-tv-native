import React, { Component } from 'react';
import List from './list';
import NavButton from './navButton';
import Routes from '../routes';
import { TabIds } from '../constants';

export default class SeasonsList extends Component {
    constructor(props) {
        super(props);

        this.getSeasons = this.getSeasons.bind(this);
        this.renderSeasonRow = this.renderSeasonRow.bind(this);
        this.playRandomEpisode = this.playRandomEpisode.bind(this);
    }
    renderSeasonRow(season) {
        const { episodes, navigator } = this.props;
        const title = `Season ${season}`;
        return (
            <NavButton text={title} onPress={() => {
                const filteredEpisodes = episodes.filter(e => e.season === season)
                    .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
                const route = {
                    ...Routes.episodes,
                    title,
                    passProps: {
                        episodes: filteredEpisodes,
                        selectTab: this.props.selectTab,
                        selectEpisode: this.props.selectEpisode
                    }
                };
                navigator.push(route);
            }} />
        );
    }
    getSeasons() {
        const seasons = [];
        for (let e of this.props.episodes) {
            if (seasons.indexOf(e.season) === -1) {
                seasons.push(e.season);
            }
        }

        return seasons.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    }
    playRandomEpisode() {
        const { episodes, selectTab, selectEpisode } = this.props;
        const randomIndex = Math.floor(Math.random() * episodes.length);
        selectEpisode(episodes[randomIndex].id);
        selectTab(TabIds.NOW_PLAYING_TAB);
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
