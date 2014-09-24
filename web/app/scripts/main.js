require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        requirejs: '../bower_components/requirejs/require',
        mustache: '../bower_components/mustache/mustache',   
        leaflet: '../bower_components/leaflet/dist/leaflet',
        cartodbjs: '../bower_components/cartodb.js/dist/cartodb.noleaflet',     
        cartodb: './cartodb',
        mapbox: '../bower_components/mapbox.js/mapbox.js'
    },
    shim: {
        'leaflet': {
            exports: 'L'
        },
        'cartodbjs': {
            deps: ['leaflet', 'jquery']
        }       
    }
});

require(['app'], function (app) {
    'use strict';    
});
