import React, { Component, View, Text, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PlayerControl from './playerControl';

class Player extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <View style={styles.controlContainer}>
                    <PlayerControl source={require('../icons/FastBackward.png')} />
                    <PlayerControl source={require('../icons/Rewind.png')} />
                    <PlayerControl source={require('../icons/Stop.png')} />
                    <PlayerControl source={require('../icons/Play.png')} />
                    <PlayerControl source={require('../icons/Forward.png')} />
                    <PlayerControl source={require('../icons/FastForeward.png')} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlContainer: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold'
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(Player);
