require.config({
    paths: {
        jquery: '../../bower_components/jquery/dist/jquery',
        requirejs: '../../bower_components/requirejs/require',
        mustache: '../../bower_components/mustache/mustache',
        leaflet: '../../bower_components/leaflet/dist/leaflet',
        cartodbjs: '../bower_components/cartodb.js/dist/cartodb.noleaflet',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        spinjs: '../../bower_components/spinjs/spin',
        cookiebar: 'jquery.cookiebar/jquery.cookiebar'
    },
    shim: {
        leaflet: {
            exports: 'L'
        },
        cartodbjs: {
            deps: [
                'leaflet',
                'jquery'
            ]
        },
        cookiebar: {
            deps: [
                'jquery'
            ]
        }
    }
});

require(['app'], function (app) {
    'use strict';
});
