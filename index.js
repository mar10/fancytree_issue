const fs = require("fs");
const entry = require("./explorer/entry.json");
const exif = require("jpeg-exif");

const getFilesWithPath = function(files, dirPath){
  return files.map((file) => `${dirPath}/${file}`);
};

const readDirContent = async function(directoryPath){
  return new Promise((resolve, reject) =>{
    fs.readdir(directoryPath, function(err, files){
      if (!err){
        return resolve(files);
      }
      return reject(err);
    });
  });
};

const consoleContent = function(dirContent){
  dirContent.map((item) => console.log(JSON.stringify(item, null, 2)));
  return dirContent;
};

const keepImagesOnly = function(dirContent){
  return dirContent.filter((elem, index, arr) => {
    return elem.match(/\.(?:jpg)$/i)
  });
};

const createImagesWithExif = function(files){
  const imagesDetailed = [];
  for (let file of files){
    imagesDetailed.push(new Promise((res, rej) => {
      const image = {
        file,
        EXIF: null
      };
      exif.parse(file, (err, data) => {
        if (err){
          console.log(`EXIF error[${err}] on ${file}`);
          return rej(err);
        }
        image.EXIF = data;
        return res(image);
      });
    }));
  }
  return Promise.all(imagesDetailed);
}

const consoleInfoForRenaming = function(arr){
  const newer = arr.reduce((all, o) => {
    const augmented = {
      filename: o.file
    };
    if ( typeof o.EXIF != "null" ){
      Object.assign(augmented, {
        date: o.EXIF.DateTime
      });
      if ( typeof o.EXIF.GPSInfo !== "undefined" ){
        augmented.gps = {};
        Object.assign(augmented.gps, {
          lat: {
            ref: o.EXIF.GPSInfo.GPSLatitudeRef,
            value: o.EXIF.GPSInfo.GPSLatitude
          },
          long: {
            ref: o.EXIF.GPSInfo.GPSLongitudeRef,
            value: o.EXIF.GPSInfo.GPSLongitude
          },
          date: o.EXIF.GPSInfo.GPSDateStamp,
          time: o.EXIF.GPSInfo.GPSTimeStamp
        });
      } else {
        augmented.gps = null;
      }
    } else {
      augmented.date = null;
    }
    all.push(augmented);
    return all;
  }, []);
  console.log(newer);
  //return newer;
};


const example = function(){
    const dirContent = readDirContent(entry.directoryPath);
    dirContent
    .then(files => getFilesWithPath(files, entry.directoryPath))
    .then(keepImagesOnly)
    //.then(consoleContent)
    .then(createImagesWithExif)
    //.then(consoleContent)
    .then(consoleInfoForRenaming)
    .then(images => {
        // usage of fs.rename(orignal, nextName, fun(err))
    })
    .catch((err) => {
        console.error(err);
    });
};

module.exports = {
    readDirContent,
    getFilesWithPath,
    keepImagesOnly,
    createImagesWithExif,
    consoleContent,
    consoleInfoForRenaming,
};



