class ApplicationController {

    constructor(authService, GData, $log, $rootScope) {
        this.authService = authService;
        this.GData = GData;
        this.$log = $log;
        this.transitionRunning = false;

        this.authService.checkLogin().then((txt) => this.$log.debug(`Application: Login check response was ${txt}`));

        $rootScope.$on('$stateChangeStart', () => {
            this.transitionRunning = true;
        });

        $rootScope.$on('transitionRunningStart', () => {
            this.transitionRunning = true;
        });

        /* $rootScope.$on('$viewContentLoading', () => {
            this.transitionRunning = false;
        }); */

        /* $rootScope.$on('$stateChangeSuccess', () => {
            this.transitionRunning = false;
        }); */

        $rootScope.$on('$stateChangeError', () => {
            this.transitionRunning = false;
        });

        $rootScope.$on('$viewContentLoaded', () => {
            this.transitionRunning = false;
        });

        $rootScope.$on('transitionRunningEnd', () => {
            this.transitionRunning = false;
        });
    }

    logout() {
        return this.authService.logout();
    }

    login() {
        return this.authService.login();
    }
}

export default [
    'authService',
    'GData',
    '$log',
    '$rootScope',
    ApplicationController
];
