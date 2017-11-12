"use strict";
const $ = require("jquery");

function createComponent(id, source, fetchNode, onClick){
    const treeConfig = {
        source,
        lazyLoad: function(event, data){
            data.result = fetchNode(event, data);
        },
        activate: function(event, data){
            // A node was activated: display its title:
            var node = data.node;
            console.log("title=" + node.title);
        },
        beforeSelect: function(event, data){
            // A node is about to be selected: prevent this for folders:
            if( data.node.isFolder() ){
                return false;
            }
        },
        click: function(event, data) {
            var node = data.node;
            // Only for click and dblclick events:
            // 'title' | 'prefix' | 'expander' | 'checkbox' | 'icon'
            console.log("title=" + node.title);
            var targetType = data.targetType;
            // we could return false to prevent default handling, i.e. generating
            // activate, expand, or select events
            console.log("title=" + node.title);
            if ( onClick ){
                onClick(event, data);
            }

        }
    };
    const o = $(id).fancytree(treeConfig);
    //o.enableNavigation = (bool)=>{ bool ? o.};
    return o;
}




module.exports = {
    fromWebPage: {
        "async": {
        },
        createComponent
    }
}
