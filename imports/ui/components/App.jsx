import React, { Component } from 'react';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types';
import { Nav, NavItem, Button, Panel } from 'react-bootstrap';
import { Grid, Row, Col } from 'react-bootstrap';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import EnergyGraph from './EnergyGraph.jsx';
import ConsumptionReference from './ConsumptionReference.jsx';
import Leaderboard from './Leaderboard.jsx';
import ProfileInfo from './ProfileInfo.jsx';
import ChangePwdWrapper from './ChangePwdWrapper.jsx';
import Marketplace from './Marketplace.jsx';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPage: 'profile'
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleSelect(selectedKey) {
        this.setState({
            selectedPage: selectedKey,
        });
    }

    handleLogout() {
        AccountsTemplates.logout();
    }

    render() {
        let userProfile = {};
        console.log('current user:');
        console.log(this.props.currentUser);
        console.log('meteor user');
        console.log(Meteor.user());
        console.log('User id:');
        console.log(Meteor.userId());
        console.log('users length');
        console.log(this.props.users.length);

        if (this.props.currentUser) {
            const blankProfile = {
                name: '',
                monthlyConsumption: '',
            };
            userProfile = this.props.currentUser.hasOwnProperty("userInfo") ? this.props.currentUser.userInfo : blankProfile;
        }

        let displayPage = '';
        if (this.props.currentUser) {
            const profilePage = (
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={12}>
                                <Panel>
                                    Hello {this.props.currentUser.emails[0].address}.
                                </Panel>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <ProfileInfo userProfile={userProfile}/>
                            </Col>
                            <Col md={8}>
                                <EnergyGraph/>
                                <ConsumptionReference currentConsumption={Math.random() * 10000}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );

            const leaderboardPage = (
                <Row>
                    <Col md={12}>
                        <Leaderboard currentUser={this.props.currentUser} users={this.props.users}/>
                    </Col>
                </Row>
            );

            const marketplacePage = (
                <Row>
                    <Col md={12}>
                        <Marketplace currentUser={this.props.currentUser} users={this.props.users}/>
                    </Col>
                </Row>
            );

            const settingsPage = (
                <Row>
                    <Col md={12}>
                        <ChangePwdWrapper/>
                    </Col>
                </Row>
            );

            if (this.state.selectedPage == 'profile') {
                displayPage = profilePage;
            } else if (this.state.selectedPage == 'leaderboard') {
                displayPage = leaderboardPage;
            } else if (this.state.selectedPage == 'marketplace') {
                displayPage = marketplacePage;
            } else {
                displayPage = settingsPage;
            }
        }

        return (
            <div className="container">
                <header>
                    <h1>TransactivE</h1>
                </header>
                {this.props.currentUser ?
                    <Grid>
                        <Row>
                            <Col md={12}>
                                <Row>
                                    <Col md={8}>
                                        <Nav bsStyle="pills" activeKey={this.state.selectedPage}
                                             onSelect={this.handleSelect}>
                                            <NavItem eventKey={'profile'}>Profile</NavItem>
                                            <NavItem eventKey={'leaderboard'}>Leaderboard</NavItem>
                                            <NavItem eventKey={'marketplace'}>Marketplace</NavItem>
                                            <NavItem eventKey={'settings'}>Settings</NavItem>
                                        </Nav>
                                    </Col>
                                    <Col md={1} mdOffset={3}>
                                        <Button bsStyle="warning" type="button" onClick={this.handleLogout}>
                                            Log out
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        { displayPage }
                    </Grid> :
                    <Grid>
                        <Row>
                            <Col md={12}>
                                <AccountsUIWrapper/>
                            </Col>
                        </Row>
                    </Grid>
                }
            </div>
        );
    }
}

App.propTypes = {
    currentUser: PropTypes.object,
    users: PropTypes.array,
};

