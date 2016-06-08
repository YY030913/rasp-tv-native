import React from 'react';
import { TextInput, Platform, StyleSheet } from 'react-native';

const SearchBar = (props) => {
    const platformSpecificProps = {};
    if (Platform.OS === 'ios') {
        platformSpecificProps.clearButtonMode = 'while-editing';
    }

    return (
        <TextInput placeholder="Search"
            style={styles.searchBar}
            autoCorrect={false}
            {...platformSpecificProps}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    searchBar: {
        height: 40,
        borderColor: '#c0c2b9',
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 15,
        marginTop: 7,
        padding: 10
    }
});

export default SearchBar;
