class LoginStateController {

    constructor(GAuth, GData, $state, $log, $window) {
        this.GAuth = GAuth;
        this.GData = GData;
        this.$state = $state;
        this.$log = $log;
        this.$window = $window;
        this.error = null;

        if (GData.isLogin()) {
            // the user is already logged in
            $state.go('app.calselect');
        }
    }
}

export default [
    'GAuth',
    'GData',
    '$state',
    '$log',
    '$window',
    LoginStateController
];
