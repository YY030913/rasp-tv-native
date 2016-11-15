import {
    Platform,
    RefreshControl,
    ListView,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import SearchBar from './searchBar';
import RandomButton from './randomButton';

/*
    Props List
    - hasChangedKey
    - items
    - filterByKey
    - isLoading
    - renderRow
    - onRefresh
    - showSearchBar
    - onRandomBtnPress
*/
export default class List extends Component {
    constructor(props) {
        super(props);

        const { hasChangedKey } = props;
        this.state = {
            searchText: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (hasChangedKey)
                        return r1[hasChangedKey] !== r2[hasChangedKey];
                    return r1 !== r2;
                }
            })
        };

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }
    componentDidMount() {
        if (this.props.items && this.props.items.length) {
            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.props.items)});
        }
    }
    componentWillReceiveProps(newProps) {
        if (this.props.items !== newProps.items) {
            this.setState({dataSource: this.state.dataSource.cloneWithRows(newProps.items)});
        }
    }
    handleSearchTextChange(newText) {
        if (!newText.length) {
            this.setState({
                searchText: newText,
                dataSource: this.state.dataSource.cloneWithRows(this.props.items)
            });
            return;
        }

        const { filterByKey } = this.props;
        const regex = new RegExp(newText, 'i');
        const filteredItems = this.props.items.filter(i => {
            if (filterByKey)
                return regex.test(i[filterByKey]);
            return regex.test(i);
        });
        this.setState({
            searchText: newText,
            dataSource: this.state.dataSource.cloneWithRows(filteredItems)
        });
    }
    renderHeader() {
        const { showSearchBar, onRandomBtnPress } = this.props;
        if (showSearchBar) {
            return <SearchBar value={this.state.searchText} onChangeText={this.handleSearchTextChange} />;
        }

        if (onRandomBtnPress) {
            return <RandomButton onPress={onRandomBtnPress} />;
        }

        return null;
    }
    render() {
        const { isLoading, onRefresh } = this.props;
        const optionalProps = {};
        if (onRefresh) {

            const platformSpecificProps = {};
            if (Platform.OS === 'ios') {
                platformSpecificProps.title = 'Loading';
            }

            optionalProps.refreshControl = (
                <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={isLoading}
                    {...platformSpecificProps}
                />
            );
        }

        const { renderRow, style } = this.props;
        return (
            <ListView
                style={[styles.container, style]}
                dataSource={this.state.dataSource}
                renderRow={renderRow}
                renderHeader={this.renderHeader}
                {...optionalProps}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
