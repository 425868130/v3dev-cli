var archiver = require('archiver');
var fs = require("fs");
var output = fs.createWriteStream("D://test.zip");
var archive = archiver('zip', {
    zlib: { level: 9 }
});
output.on('close', function() {
	
});
archive.on('error', function(err){
	console.log(err);
});
archive.pipe(output);
archive.directory("test","test");
archive.finalize();