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

        this.browser = this.getBrowser();
        this.userAgent = this.$window.navigator.userAgent;
    }

    getBrowser() {
        const ie = this.detectIE();

        if (ie !== false) {
            return 'ie';
        }

        const userAgent = this.$window.navigator.userAgent;
        const browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };

        for (const key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        }
        return 'unknown';
    }

    detectIE() {
        const ua = this.$window.navigator.userAgent;
        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
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
