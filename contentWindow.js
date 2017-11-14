"use strict";
const $ = require("jquery");
window.jQuery = $;
window.$ = $;
// const jquery_ui = require('./bower_components/jquery-ui/jquery-ui');
// const explorerLoader = require("jquery.fancytree/dist/jquery.fancytree-all-deps.min");
const explorerLoader = require("jquery.fancytree");
const explorer = require("./explorer").fromWebPage;

console.log("explorerLoader", explorerLoader);

function getTreeSourceFromDirContent(){
    const source = [
        {title: "Node 1", key: "1"},
        {title: "Folder 2", key: "2", folder: true, children: [
            {title: "Node 2.1", key: "3"},
            {title: "Node 2.2", key: "4"}
        ]}
    ];
    return source;
}

const source = getTreeSourceFromDirContent();
const finder = explorer.createComponent("div#exploreDir", source);




