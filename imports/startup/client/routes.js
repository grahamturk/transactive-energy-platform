import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import AppContainer from '../../ui/containers/AppContainer.js';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={AppContainer}/>
        </div>
    </Router>
);
