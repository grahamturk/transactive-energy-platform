import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import LeaderboardUser from './LeaderboardUser.jsx';
import { Table } from 'react-bootstrap';

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasLeaderboard: false,
        };
    }

    componentDidMount() {
        console.log('in component did mount');
        console.log(this.props.users.length);

        this.fetchUsers();
    }


    fetchUsers() {
        if (this.props.users) {
            this.setState({
                hasLeaderboard: true
            });
        }

        /*
        const self = this;
        Meteor.call('fetchLeaderboard', (error, result) => {
            if (error) {
                alert(error.error);
                self.setState({
                    hasLeaderboard: false
                });
            } else {
                self.setState({
                    hasLeaderboard: true,
                    users: result,
                });
            }
        });
        */
    }


    renderUsers() {
        const currentUserTxId = this.props.currentUser && this.props.currentUser.txId;
        console.log('user txId= ' + currentUserTxId);
        let currRank = 0;
        return this.props.users.map((user) => {
            const isCurrentUser = user.txId === currentUserTxId;
            currRank += 1;
            return (
                <LeaderboardUser
                    key={user.txId}
                    rank={currRank}
                    user={user}
                    isCurrentUser={isCurrentUser}
                />
            );
        })
    }

    render() {
        return (
            this.state.hasLeaderboard ?
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Electricity Consumption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUsers()}
                    </tbody>
                </Table> :
                <p>Problem loading leaderboard</p>
        );
    }
}

Leaderboard.propTypes = {
    currentUser: PropTypes.object,
    users: PropTypes.array,
};

