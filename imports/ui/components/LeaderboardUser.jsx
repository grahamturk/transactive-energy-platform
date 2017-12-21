import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

export default class LeaderboardUser extends Component {

    render() {
        const userClassName = classnames({
            currentUser: this.props.isCurrentUser,
        });

        return (
            <tr className={userClassName}>
                <td>{this.props.rank}</td>
                <td>{this.props.user.name}</td>
                <td>{this.props.user.consumption} kWh</td>
            </tr>
        );
    }
}

LeaderboardUser.propTypes = {
    user: PropTypes.object,
    isCurrentUser: PropTypes.bool,
    rank: PropTypes.number,
};