import React, { Component } from 'react-native';
import List from './list';
import NavButton from './navButton';

export default class SeasonsList extends Component {
    constructor(props) {
        super(props);

        this.getSeasons = this.getSeasons.bind(this);
        this.renderSeasonRow = this.renderSeasonRow.bind(this);
    }
    renderSeasonRow(season) {
        return <NavButton text={`Season ${season}`} />;
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
    render() {
        return (
            <List
                items={this.getSeasons()}
                renderRow={this.renderSeasonRow}
            />
        );
    }
}
