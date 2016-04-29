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
            },
            resolve: {
                selectedCalendar: ['calendarService', '$state', '$q', '$timeout', (calendarService, $state, $q, $timeout) => {
                    const deferred = $q.defer();
                    const cal = calendarService.getCalendarSelection();
                    if (!cal || !cal.id) {
                        $timeout(() => $state.go('app.calselect'));
                        deferred.reject('there is no calendar selection yet. will go to calselect');
                    } else {
                        deferred.resolve(cal);
                    }
                    return deferred.promise;
                }]
            }
        });
}

export default [
    '$stateProvider',
    calcreateRouteConfig
];
