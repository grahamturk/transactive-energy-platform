import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { AccountsTemplates } from 'meteor/useraccounts:core';

export default class AccountsUIWrapper extends Component {
    componentDidMount() {
        console.log('AccountsTemplate state: ' + AccountsTemplates.getState());
        this.view = Blaze.render(Template.atForm,
            ReactDOM.findDOMNode(this.refs.container));
    }

    componentWillUnmount() {
        Blaze.remove(this.view);
    }

    render() {
        return <span ref="container" />
    }
}