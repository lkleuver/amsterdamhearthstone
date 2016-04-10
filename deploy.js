var AWS       = require('aws-sdk');
var fs        = require("fs");
var recursive = require("recursive-readdir");
var async     = require("async");
var mime      = require("mime-types");
var config    = require('./config')


recursive(config.aws.source, ['.DS_Store'], function (err, files) {
  async.each(files, function(file, callback) {
    uploadFile(file, callback);
  },
  function (err) {
    console.log("done?");
    console.log(err);
  });
});



//AWS PART------------------------------------------------------------
AWS.config.region = 'eu-central-1';
AWS.config.accessKeyId = config.aws.key;
AWS.config.secretAccessKey = config.aws.secret;

var s3 = new AWS.S3();

function uploadFile(f, cb) {
  
  var params = {
    "Bucket": config.aws.bucket,
    "Key": popSourceFolder(f),
    "Body": fs.readFileSync(f),
    "ContentType": mime.lookup(f) + ""
  };

  //console.log(params.ContentType, typeof params.ContentType);
  s3.putObject(params, cb);
}

function popSourceFolder(path) {
  return path.replace(config.aws.source + "/", "");
}