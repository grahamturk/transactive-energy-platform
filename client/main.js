// Client entry point, imports all client code
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js';

import '../imports/startup/both/accounts-config.js';
import 'react-select/dist/react-select.css';

Meteor.startup(() => {
    console.log('In Startup');
    render(renderRoutes(), document.getElementById('render-target'));
});
