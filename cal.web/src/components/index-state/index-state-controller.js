class IndexStateController {
    constructor(authService, GData, $log) {
        this.authService = authService;
        this.$log = $log;

        // this.authService.checkLogin().then((txt) => this.$log.debug(`Index: Login check response was ${txt}`));
/*
        if (GData.isLogin()) {
            // the user is already logged in
            this.$state.go('app.calselect');
        }
*/
    }
}

export default [
    'authService',
    'GData',
    '$log',
    IndexStateController
];
