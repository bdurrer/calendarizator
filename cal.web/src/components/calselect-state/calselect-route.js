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
            },
            resolve: {
                listItems: ['GData', 'calendarService', 'authService', '$state', '$q', '$timeout', (GData, calendarService, authService, $state, $q, $timeout) => {
                    if (!GData.isLogin()) {
                        const deferred = $q.defer();
                        authService.checkLogin().then(() => {
                            calendarService.getCalendars().then(
                                (response) => deferred.resolve(response.items),
                                () => {
                                    $timeout(() => $state.go('app.index'));
                                    deferred.reject('failed to load calendars for calselect state. will go to index');
                                }
                            );
                        }, () => {
                            $timeout(() => $state.go('app.index'));
                            deferred.reject('user is not logged in. will go to index');
                        });
                        return deferred.promise;
                    }
                    return calendarService.getCalendars().then((response) => response.items);
                }]
            }
        });
}

export default [
    '$stateProvider',
    calselectRouteConfig
];
