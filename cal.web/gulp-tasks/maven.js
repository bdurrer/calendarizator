'use strict';

module.exports = (gulp) => {
    gulp.task('mvn-copyjspm', ['bundle'], () => gulp
        .src(['jspm_packages/**/*'])
        .pipe(gulp.dest('target/resources/jspm_packages'))
    );


    gulp.task('mvn-copyconfig', ['bundle'], () => gulp
        .src(['config/system.js'])
        .pipe(gulp.dest('target/resources/config'))
    );

    gulp.task('mvn-copybase', ['bundle'], () => gulp
        .src(['index.html', 'favicon.ico'])
        .pipe(gulp.dest('target/resources'))
    );

    gulp.task('mvn-copybuild', ['bundle'], () => gulp
        .src(['build/**/*'])
        .pipe(gulp.dest('target/resources/build'))
    );

    gulp.task('maven', ['bundle', 'mvn-copyjspm', 'mvn-copyconfig', 'mvn-copybase', 'mvn-copybuild']);
};
