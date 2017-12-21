import React, { Component } from 'react';
import { Template } from 'meteor/templating';
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class UserAccountsWrapper extends Component {
    render() {
        console.log('user accounts being rendered');
        return (
            <div>
                <Blaze template="atForm" className="blaze-at-form" />
            </div>
        );
    }
}
