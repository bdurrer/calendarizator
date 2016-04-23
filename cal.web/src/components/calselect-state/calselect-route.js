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
                listItems(GData, calendarService, authService, $state, $q) {
                    if (!GData.isLogin()) {
                        const deferred = $q.defer();
                        authService.checkLogin().then(() => {
                            calendarService.getCalendars().then(
                                (response) => deferred.resolve(response.items),
                                () => $state.go('app.index')
                            );
                        }, () => $state.go('app.index'));
                        return deferred.promise;
                    }
                    return calendarService.getCalendars().then((response) => response.items);
                }
            }
        });
}

export default [
    '$stateProvider',
    calselectRouteConfig
];
