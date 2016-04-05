
function googleApiConfig(GAuth, GApi, GData, $state, $rootScope) {
	
/*
	$rootScope.gdata = GData;

	const CLIENT = 'yourGoogleAuthAPIKey';
	const BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
	//GApi.load('myApiName','v1',BASE);
	
	GApi.load('calendar','v3'); // for google api (https://developers.google.com/apis-explorer/)

	GAuth.setClient(CLIENT);
	GAuth.setScope("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly"); // default scope is only https://www.googleapis.com/auth/userinfo.email

	GAuth.checkAuth().then(
		function (user) {
			//console.log(user.name + 'is login')
			$state.go('app.index'); // an example of action if it's possible to
			// authenticate user at startup of the application
		},
		function() {
			$state.go('login');       // an example of action if it's impossible to
			// authenticate user at startup of the application
		}
	);
*/

/*
	var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
	GApi.load('myApiName','v1',BASE).then(function(resp) {
		console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
	}, function(resp) {
		console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
	});
*/
}

export default [
    'GAuth',
	'GApi',
	'GData',
	'$state',
	'$rootScope',
    googleApiConfig
];