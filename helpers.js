import React, { Component } from 'react';

export function withLifecycleLogging(Inner, tag) {
    return class extends Component {
        componentDidMount() {
            console.log(`[${tag}] - componentDidMount`);
        }
        componentWillReceiveProps(newProps) {
            console.log(`[${tag}] - componentWillReceiveProps, ${Object.keys(newProps).join(', ')}`);
        }
        componentWillUnmount() {
            console.log(`[${tag}] - componentWillUnmount`);
        }
        render() {
            console.log('Render');
            return <Inner {...this.props} />;
        }
    };
}
