import React, {
    Component,
    View,
    Text,
    Platform,
    RefreshControl,
    ListView,
    StyleSheet
} from 'react-native';

import SearchBar from './searchBar';

/*
    Props List
    - hasChangedKey
    - items
    - filterByKey
    - isLoading
    - renderRow
    - onRefresh
*/
export default class FilterableList extends Component {
    constructor(props) {
        super(props);

        const { hasChangedKey } = props;
        this.state = {
            searchText: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1[hasChangedKey] !== r2[hasChangedKey]
            })
        };

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.renderSearchBar = this.renderSearchBar.bind(this);
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
        const filteredItems = this.props.items.filter(i => regex.test(i[filterByKey]));
        this.setState({
            searchText: newText,
            dataSource: this.state.dataSource.cloneWithRows(filteredItems)
        });
    }
    renderSearchBar() {
        return <SearchBar value={this.state.searchText} onChangeText={this.handleSearchTextChange} />;
    }
    render() {
        const { isLoading } = this.props;
        if (isLoading) {
            return (
                <View style={styles.loadingView}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        const platformSpecificProps = {};
        if (Platform.OS === 'ios') {
            platformSpecificProps.title = 'Loading';
        }

        const { onRefresh } = this.props;
        const refresher = (
            <RefreshControl
                onRefresh={onRefresh}
                refreshing={isLoading}
                {...platformSpecificProps}
            />
        );

        const { renderRow } = this.props;
        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={renderRow}
                renderHeader={this.renderSearchBar}
                refreshControl={refresher}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
