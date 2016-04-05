import template from './login-state.html!text';

function loginRouteConfig($stateProvider) {
    $stateProvider
        .state('app.login', {
            url: 'login',
            views: {
                application: {
                    controller: 'LoginStateController as loginState',
                    template
                }
            }
        });
}

export default [
    '$stateProvider',
    loginRouteConfig
];
