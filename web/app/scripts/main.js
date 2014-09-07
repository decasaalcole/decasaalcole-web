require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        requirejs: '../bower_components/requirejs/require',
        mustache: '../bower_components/mustache/mustache',        
        cartodb: './cartodb',
    },
    shim: {
        
    }
});

require(['app'], function (app) {
    'use strict';
    
});
