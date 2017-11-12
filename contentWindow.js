// Run in the browser window
"use strict";
const nodeVersion = process.versions.node;
const chromeVersion = process.versions.chrome;
const electronVersion = process.versions.election;
const $ = require("jquery");
const path = require('path');
window.jQuery = $;
window.$ = $;
const {fromWebPage} = require("./asyncRequest");
const {ipcRenderer} = require("electron");
const jquery_ui = require('./bower_components/jquery-ui/jquery-ui');
const explorerLoader = require("jquery.fancytree/dist/jquery.fancytree-all-deps.min");
const explorer = require("./explorer").fromWebPage;
const ptext = `We are using node ${nodeVersion} Chrome ${chromeVersion} and Electron ${electronVersion}`;

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
const fetchNode = async function _fetchNode(event, data){
    const retval = await fromWebPage.async.sendMsg("dirContent", {path: data.node.key})
    .then((result) => {
        const deeperNode = transformDirInExplorer(result, data.node.key);
        return deeperNode;
    });
    return retval;
};

const fileSelect = async function _fileSelect(event, data){
    const filename = data.node.key;
    const imgFileMatch = /\.(gif|jpg|jpeg|tiff|png)$/i;
    if ( imgFileMatch.test(filename) ){
        const img = $("img#img0");
        img.attr("src", path.join(filename));
    }
};

const finder = explorer.createComponent("div#exploreDir",
    source,
    fetchNode,
    fileSelect);
async function getDirContent(path) {
    const result = await fromWebPage.async.sendMsg("dirContent", {path});
    const newSource = transformDirInExplorer(result, path);
    finder.fancytree('getTree').reload(newSource);
    return result;
}

let key = 1;
function transformDirInExplorer(incoming, prefix){
    const newSource = incoming.data.dirContent.map(file => {
        const o = {
            title: file.file,
            key: prefix + "/" + file.file,
        };
        if (file.stat.isDirectory){
            o.folder = true;
            o.children = null;
            o.lazy = true;
        }
        return o;
    });
    return newSource;
}

//setTimeout(sendOneMsg, 5000);
$("button#readDir").click(function(event){
    const directoryPath = $("input#directoryPath").val();
    const dirContent = getDirContent(directoryPath);
    //console.log(JSON.stringify(dirContent));
});


$("p#txt1").text(ptext);
const updatePhoto = function (sender, params) {
    console.log("Update called", JSON.stringify(sender), JSON.stringify(params));
};
ipcRenderer.on("updatePhoto", updatePhoto);




