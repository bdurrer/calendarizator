import template from './calcreate-state.html!text';

function calcreateRouteConfig($stateProvider) {
    $stateProvider
        .state('app.calcreate', {
            url: 'calcreate',
            views: {
                application: {
                    controller: 'CalcreateStateController as calcreateState',
                    template
                }
            }
        });
}

export default [
    '$stateProvider',
    calcreateRouteConfig
];
