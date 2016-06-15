import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules, NativeAppEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { SessionActions } from '../actions';
import List from './list';

const { ChromecastManager } = NativeModules;

class ChromecastView extends Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
    }
    componentDidMount() {
        const { setDevices } = this.props;
        this._deviceListChanged = NativeAppEventEmitter.addListener('DeviceListChanged', (data) => setDevices(data.Devices));
        // this._mediaStatusUpdated = NativeAppEventEmitter.addListener('MediaStatusUpdated', (data) => console.log(data));
        ChromecastManager.startScan();
    }
    componentWillUnmount() {
        this._deviceListChanged.remove();
        // this._mediaStatusUpdated.remove();
    }
    renderRow(device) {
        const { selectDevice } = this.props;
        return (
            <TouchableOpacity style={styles.row} onPress={() => selectDevice(device)}>
                <Text style={styles.rowText}>{device}</Text>
            </TouchableOpacity>
        );
    }
    render() {
        const { devices, selectedDevice } = this.props;
        if (selectedDevice !== null) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={function(){}}>
                        <Text style={styles.disconnectBtn}>Disconnect</Text>
                    </TouchableOpacity>
                    <Text style={styles.rowText}>Connected to {selectedDevice}</Text>
                </View>
            );
        }

        return <List items={devices} renderRow={this.renderRow} />;
    }
}

const styles = StyleSheet.create({
    disconnectBtn: {
        fontSize: 35,
        color: '#3084ba'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 70
    },
    row: {
        margin: 20
    },
    rowText: {
        fontSize: 15,
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    return {
        devices: state.session.data.devices,
        selectedDevice: state.session.data.selectedDevice
    };
}

export default connect(mapStateToProps, {
    setDevices: SessionActions.setDevices,
    selectDevice: SessionActions.selectDevice
})(ChromecastView);