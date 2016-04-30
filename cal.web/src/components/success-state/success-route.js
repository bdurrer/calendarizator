import template from './success-state.html!text';

function successRouteConfig($stateProvider) {
    $stateProvider
        .state('app.success', {
            url: 'success',
            views: {
                application: {
                    controller: 'SuccessStateController as successState',
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
    successRouteConfig
];
