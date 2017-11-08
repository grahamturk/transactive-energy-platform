import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import App from '../components/App.jsx';

export default AppContainer = withTracker(() => {
    return {
        currentUser: Meteor.user(),
        favoriteNumber: 9,
    };
})(App);