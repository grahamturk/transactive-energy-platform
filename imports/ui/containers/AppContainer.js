import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import App from '../components/App.jsx';

export default AppContainer = withTracker(() => {
    Meteor.subscribe('Meteor.users.userInfo');
    Meteor.subscribe('Meteor.users.balance');
    Meteor.subscribe('Meteor.users.txId');
    Meteor.subscribe('Meteor.users');
    console.log('app tracker');

    return {
        currentUser: Meteor.user(),
        users: Meteor.users.find({}).map(user => {
            return {
                name: user.userInfo.name,
                txId: user.txId,
                consumption: user.userInfo.monthlyConsumption,
            }
        }),
    }
})(App);