import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ShowsActions } from '../actions';
import ShowsList from './showsList';

class ShowsContainer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getShows();
    }
    render() {
        return <ShowsList {...this.props} />;
    }
}

function mapStateToProps(state) {
    return {
        shows: state.shows.data,
        isLoading: state.shows.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getShows: ShowsActions.get,
        selectEpisode: ShowsActions.select
     }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowsContainer);
