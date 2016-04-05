import template from './calselect-state.html!text';

function calselectRouteConfig($stateProvider) {
    $stateProvider
        .state('app.calselect', {
            url: 'calselect',
            views: {
                application: {
                    controller: 'CalselectStateController as calselectState',
                    template
                }
            }
        });
}

export default [
    '$stateProvider',
    calselectRouteConfig
];
