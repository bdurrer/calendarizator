class IndexStateController {
    constructor(GAuth, GData, $state, $log, $cookies) {
        if (GData.isLogin()) {
            // the user is already logged in
            $state.go('app.calselect');
        } else {
            const currentUser = $cookies.get('userId');
            if (currentUser) {
                $log.debug('found login cookie, trying to re-auth...');
                GData.setUserId(currentUser);
                GAuth.checkAuth().then(
                    () => {
                        $log.debug('nice, the user is authed by cookie');
                        $state.go('app.calselect');
                    },
                    () => {
                        $log.debug('user cannot be authed by cookie, goto login');
                        $state.go('app.login');
                    }
                );
            } else {
                $state.go('app.login');
            }
        }
    }
}

export default [
    'GAuth',
    'GData',
    '$state',
    '$log',
    '$cookies',
    IndexStateController
];
