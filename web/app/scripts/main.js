require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        requirejs: '../bower_components/requirejs/require',
        mustache: '../bower_components/mustache/mustache',        
        cartodb: './cartodb',
        leaflet: '../bower_components/leaflet/dist/leaflet'
    },
    shim: {
        
    }
});

require(['app'], function (app) {
    'use strict';
    
});
