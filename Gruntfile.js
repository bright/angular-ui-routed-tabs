'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.initConfig({
        jshint: {
            options: {
                globalstrict: true,
                loopfunc: true,
                browser: true,
                devel: true,
                globals: {
                    angular: true,
                    $: false,
                    moment: false,
                    Pikaday: false,
                    module: false,
                    forge: false
                }
            },
            beforeconcat: {
                options: {
                    force: true,
                    ignores: ['**.min.js']
                },
                files: {
                    src: ['**.js']
                }
            }
        },
        ngAnnotate: {
            build: {
                files: {},
                src: 'ui-routed-tabs.js',
                dest: 'ui-routed-tabs.min.js'
            }
        },
        uglify: {
            build: {
                files: {},
                src: 'ui-routed-tabs.min.js',
                dest: 'ui-routed-tabs.min.js'
            }
        }
    });

    grunt.registerTask('default', ['jshint:beforeconcat', 'ngAnnotate:build', 'uglify:build']);
};