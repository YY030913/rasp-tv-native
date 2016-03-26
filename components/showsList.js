import React, { Component, View } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FilterableList from './filterableList';
import NavButton from './navButton';
import { ShowsActions } from '../actions';
import Routes from '../routes';
import GlobalStyles from '../globalStyles';

class ShowsList extends Component {
    constructor(props) {
        super(props);

        this.fetchShows = this.fetchShows.bind(this);
        this.renderShow = this.renderShow.bind(this);
    }
    componentWillMount() {
        this.fetchShows();
    }
    fetchShows() {
        this.props.loadingShows();
        this.props.getShows();
    }
    renderShow(show) {
        const route = {...Routes.seasons, passProps: {episodes: show.episodes}};
        return <NavButton text={show.title} onPress={() => this.props.navigator.push(route)} />;
    }
    render() {
        const { isLoading, shows } = this.props;

        return (
            <View style={GlobalStyles.navContent}>
                <FilterableList
                    hasChangedKey="id"
                    items={shows}
                    filterByKey="title"
                    isLoading={isLoading}
                    renderRow={this.renderShow}
                    onRefresh={this.fetchShows}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        shows: state.shows.data,
        isLoading: state.shows.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        loadingShows: ShowsActions.loading,
        getShows: ShowsActions.get
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowsList);
