import React, { Component } from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import PropTypes from 'prop-types';
import EnergyGraph from './EnergyGraph.jsx';

export default class App extends Component {
    render() {
        return (
            <div className="container">
                <header>
                    <h1>TransactivE</h1>
                </header>
                {this.props.currentUser ?
                    <p>
                        Hello {this.props.currentUser.emails[0].address}. Your favorite number is {this.props.favoriteNumber}!
                    </p>:
                    ''
                }
                <AccountsUIWrapper />
                <EnergyGraph />
            </div>
        );
    }
}

App.propTypes = {
    currentUser: PropTypes.object,
    favoriteNumber: PropTypes.number,
};

