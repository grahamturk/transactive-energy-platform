// Client entry point, imports all client code
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js';

console.log('inside client main');
import '../imports/startup/both';
import 'react-select/dist/react-select.css';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('render-target'));
});
