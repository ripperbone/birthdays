var express = require('express');
var app = express();
var vCard = require('vcf');
var fs = require('fs');

//var card = new vCard().parse(dd


function parseContactsFile(vcfFile) {
   return new Promise(function (resolve, reject) {
      fs.readFile(vcfFile, 'utf8', function (err, data) {
         if (err) {
            return console.log(err);
         }
         resolve(data);
      });
   });
}


app.get('/', function (req, res) {
   parseContactsFile('contacts.vcf').then(function(val) {
      res.send(val);
   });
});

const LISTEN_PORT = 8080;

app.listen(LISTEN_PORT, function () {
   console.log('listening on port', LISTEN_PORT);
});
