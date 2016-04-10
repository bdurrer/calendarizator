class ApplicationController {

    constructor(GAuth, GData, $cookies, $state, $log) {
        this.GAuth = GAuth;
        this.GData = GData;
        this.$cookies = $cookies;
        this.$log = $log;
        this.$state = $state;

        if (!GData.isLogin()) {
            // the user is already logged in
            $state.go('app.login');
        }
    }

    logout() {
        const _self = this;
        this.GAuth.logout().then(() => {
            _self.$cookies.remove('userId');
            _self.$state.go('app.login');
        });
    }

    login() {
        const _self = this;

        const _ifLogin = function () {
            if (_self.GData.getUserId() === null) {
                _self.$log.debug('login returned successful, but the userId was NULL');
            } else {
                _self.$log.debug(`logged in successfully, userId is ${_self.GData.getUserId()}`);
                _self.$cookies.put('userId', _self.GData.getUserId());
                _self.$state.go('app.calselect');
            }
        };

        this.GAuth.checkAuth().then(() => {
            _self.$log.info('login check successful, skipping login()');
            _ifLogin();
        },
        () => {
            _self.$log.info('login over GAuth.login() now...');
            _self.GAuth.login().then(() => _ifLogin(),
            () => {
                // failure-param: response
                _self.$log.info('auth over GAuth.login() failed!');
            });
        });
    }
}

export default [
    'GAuth',
    'GData',
    '$cookies',
    '$state',
    '$log',
    ApplicationController
];
