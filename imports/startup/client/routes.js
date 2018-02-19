import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import AppContainer from '../../ui/containers/AppContainer.js';
import UportApp from '../../ui/components/UportApp.jsx';
//import Survey from '../'

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={UportApp}/>
        </div>
    </Router>
);
