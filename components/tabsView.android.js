import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MoviesContainer from './moviesContainer';

const TabsView = (props) => {
    return (
        <View style={styles.container}>
            <MoviesContainer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TabsView;
