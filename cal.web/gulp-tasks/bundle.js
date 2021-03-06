'use strict';

const Bundler = require('angular-lazy-bundler');

module.exports = (gulp) => {
    gulp.task('bundle', ['build'], (done) => {
        const bundler = new Bundler({
            systemJsConfig: 'config/system.js'
        });

        bundler
            .bundle({
                components: [
                    'application',
                    'index-state'
                ],
                packages: [
                    'angular',
                    'angular-ui-router',
                    'ui-router-extras',
                    'oclazyload',
                    'angular-translate',
                    'css',
                    'json',
                    'text'
                ]
            }, 'main')
            .then(() => bundler.bundleRemainingComponents())
            .then(() => bundler.bundleRemainingPackages())
            .then(() => bundler.saveConfig())
            .then(() => done())
            .catch((err) => done(err));
    });
};
