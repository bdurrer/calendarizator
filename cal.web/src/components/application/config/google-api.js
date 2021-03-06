/* eslint no-param-reassign: 0 */

function googleApiConfig(GAuth, GApi, $log) {
    const CLIENT = '948709330298-230d1pmktbgcmcdd2urhml3qt23nff7i.apps.googleusercontent.com';
    const BASE = 'https://calendarizator.appspot.com/_ah/api';
    // const BASE = 'http://localhost:8080/_ah/api';
    // const BASE = '/_ah/api';

    GApi.load('calApi', 'v1', BASE);

    GApi.load('calendar', 'v3'); // for google api (https://developers.google.com/apis-explorer/)

    GAuth.setClient(CLIENT);

    // default scope is only https://www.googleapis.com/auth/userinfo.email
    GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar');

    // preload oauth2 since we worked around the popup blocker issue by disabling the loader
    GAuth.load().then(() => $log.debug('oauth is loaded'));
    // GApi.load('oauth2', 'v2');
}

export default [
    'GAuth',
    'GApi',
    '$log',
    googleApiConfig
];
