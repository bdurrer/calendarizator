/* eslint no-param-reassign: 0 */

function googleApiConfig(GAuth, GApi) {
    const CLIENT = '948709330298-kj0d9ll4brtbg8e1urjhum7f7dt3515u.apps.googleusercontent.com';
    // const BASE = 'https://calendarizator.appspot.com/_ah/api';
    const BASE = 'http://localhost:8080/_ah/api';
    GApi.load('calApi', 'v1', BASE);

    GApi.load('calendar', 'v3'); // for google api (https://developers.google.com/apis-explorer/)

    GAuth.setClient(CLIENT);
    GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar'); // default scope is only https://www.googleapis.com/auth/userinfo.email
/*
    var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
    GApi.load('myApiName','v1',BASE).then(function(resp) {
        console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
    }, function(resp) {
        console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
    });
*/

    // try auto-login using a auth cookie
/* **** This is already handled in the application
    const currentUser = $cookies.get('userId');
    if (currentUser) {
        GData.setUserId(currentUser);
        GAuth.checkAuth().then(() => {
            $state.go('app.calselect');
        });
    }
*/
}

export default [
    'GAuth',
    'GApi',
    googleApiConfig
];
