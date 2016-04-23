
class AuthService {

    constructor(GApi, GData, GAuth, $state, $cookies, $q, $log) {
        this.GApi = GApi;
        this.GData = GData;
        this.GAuth = GAuth;
        this.$state = $state;
        this.$cookies = $cookies;
        this.$q = $q;
        this.$log = $log;
    }

    checkLogin() {
        const deferred = this.$q.defer();
        if (this.GData.isLogin()) {
            deferred.resolve('User is already logged in');
            return deferred.promise;
        }

        const currentUser = this.$cookies.get('userId');
        if (currentUser) {
            this.GData.setUserId(currentUser);
            this.GAuth.checkAuth().then(() => {
                deferred.resolve('Login from cookie successful');
            },
            () => {
                deferred.reject('Login failed');
                this.$state.go('app.login');
            });
        } else {
            deferred.reject('No login cookie available');
            this.$state.go('app.login');
        }

        return deferred.promise;
    }

    handleGapiFailure(response) {
        this.$log.debug('failed to fetch data from google API');
        if (response && response.code === 401 && response.error) {
            if (response.error.message === 'Login Required') {
                this.$state.go('app.login');
                return true;
            }
        }
        return false;
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

    logout() {
        const _self = this;
        this.GAuth.logout().then(() => {
            _self.$cookies.remove('userId');
            _self.$state.go('app.login');
        });
    }
}

export default [
    'GApi',
    'GData',
    'GAuth',
    '$state',
    '$cookies',
    '$q',
    '$log',
    AuthService
];
