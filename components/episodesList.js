import React, { Component } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from './list';
import NavButton from './navButton';
import { ShowsActions, selectTab } from '../actions';
import { TabIds } from '../constants';

class EpisodesList extends Component {
    constructor(props) {
        super(props);

        this.renderEpisodeRow = this.renderEpisodeRow.bind(this);
    }
    renderEpisodeRow(episode) {
        const playAndSwitchTab = () => {
            this.props.selectEpisode(episode.id);
            this.props.selectTab(TabIds.NOW_PLAYING_TAB);
        };

        return <NavButton text={`${episode.number} - ${episode.title}`} onPress={playAndSwitchTab} />;
    }
    render() {
        const { episodes } = this.props;
        return (
            <List
                hasChangedKey="id"
                items={episodes}
                filterByKey="title"
                renderRow={this.renderEpisodeRow}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        selectEpisode: ShowsActions.select,
        selectTab
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(null, mapDispatchToProps)(EpisodesList);
