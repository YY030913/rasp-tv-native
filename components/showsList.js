import React, { Component } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FilterableList from './filterableList';
import NavButton from './navButton';
import { ShowsActions } from '../actions';

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
        return <NavButton text={show.title} onPress={() => console.log(this.props.navigator)} />;
    }
    render() {
        const { isLoading, shows } = this.props;

        return (
            <FilterableList
                hasChangedKey="id"
                items={shows}
                filterByKey="title"
                isLoading={isLoading}
                renderRow={this.renderShow}
                onRefresh={this.fetchShows}
            />
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
