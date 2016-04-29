import './stylesheets/application.css!';
import 'babel/external-helpers';
import angular from 'angular';
import 'angular-i18n/de-ch';
import 'angular-cookies';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ui-router-extras';
import ocLazyLoad from 'oclazyload';
import ngLazy from 'angular-lazy';

import 'moment/moment';
import 'moment/locale/de';
import 'moment-timezone';

import momentFilter from './moment-filter';

import 'angular-ui-bootstrap';

import 'angular-translate';
import translationsModule from './i18n/translations';

import 'marceljuenemann/angular-drag-and-drop-lists';
// import 'angular-google-gapi/dist/angular-google-gapi'; // debugging
// import 'angular-google-gapi'; // minified
import './angular-google-gapi';

import defaultLocaleConfig from './config/default-locale';
import routingConfig from './config/routing';
import errorHandlingConfig from './config/error-handling';
import googleApiConfig from './config/google-api';

import constants from './config/constants.json!';
import ApplicationController from './application-controller';
import applicationRoute from './application-route';

import CalendarService from './calendar-service';
import AuthService from './auth-service';

const dependencies = [
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    ocLazyLoad,
    'ct.ui.router.extras',
    'ct.ui.router.extras.future',
    ngLazy.name,
    'pascalprecht.translate',
    'angular-google-gapi',
    'dndLists',
    translationsModule.name
];

const app = angular
    .module('application-component', dependencies)
    .controller('ApplicationController', ApplicationController)
    .service('calendarService', CalendarService)
    .service('authService', AuthService)
    .filter('moment', momentFilter)
    .config(routingConfig)
    .config(applicationRoute)
    .config(defaultLocaleConfig)
    .run(errorHandlingConfig)
    .run(googleApiConfig);

Object.keys(constants).forEach((constantName) => {
    app.constant(constantName, constants[constantName]);
});

export default app;
