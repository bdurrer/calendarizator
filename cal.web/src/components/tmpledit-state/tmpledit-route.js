import template from './tmpledit-state.html!text';

function tmpleditRouteConfig($stateProvider, calendarService) {
    $stateProvider
        .state('app.tmpledit', {
            url: 'tmpledit',
            views: {
                application: {
                    controller: 'TmpleditStateController as tmpleditState',
                    template
                }
            },
            resolve: {
                tmpl: {}
            }
        })
        .state('app.tmpledit', {
            url: 'tmpledit/:tmplid',
            views: {
                application: {
                    controller: 'TmpleditStateController as tmpleditState',
                    template
                }
            },
            resolve: {
                tmpl: ['$stateParams', ($stateParams) => calendarService.getEventTemplate($stateParams.tmplid)]
            }
        });
}

export default [
    '$stateProvider',
    'calendarService',
    tmpleditRouteConfig
];
