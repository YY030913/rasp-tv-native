import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getShows } from '../actions/shows';
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

export default connect(mapStateToProps, { getShows })(ShowsContainer);
