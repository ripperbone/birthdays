var express = require('express');
var app = express();
var vCard = require('vcardparser');
var fs = require('fs');


function parseContactsFile(vcfFile) {
   return new Promise( (resolve, reject) => {

      fs.readFile(vcfFile, 'utf8', (err, allvCards) => {

         var parsedContacts = [];
         allvCards.split(/(?=BEGIN:VCARD)/).forEach( (vCardString) => {
            vCard.parseString(vCardString, (err, json) => {
               if (err) {
                  return console.log(err);
               }

               ['begin', 'end', 'prodid', 'version'].forEach( (keyToRemove) => delete json[keyToRemove]);

               parsedContacts.push(json);
            });
         });
         resolve(parsedContacts);
      });
   });
}



app.get('/', (req, res) => {
   parseContactsFile('contacts.vcf').then( parsedContacts => {
      res.send(parsedContacts);
   });
});

app.get('/lastname/:lastname', (req, res) => {
   parseContactsFile('contacts.vcf').then( parsedContacts => {
      res.send(parsedContacts.filter( contact => contact['n']['last'].toLowerCase() == req.params.lastname.toLowerCase() ));
   });
});

app.get('/birthdays', (req, res) => {
   parseContactsFile('contacts.vcf').then( parsedContacts => {
      res.send(parsedContacts.filter( contact => new Date(contact['bday']).getMonth() == new Date().getMonth() ));
   });
});

// use integer value for month
app.get('/birthdays/:month', (req, res) => {
   parseContactsFile('contacts.vcf').then( parsedContacts => {
      res.send(parsedContacts.filter( contact => new Date(contact['bday']).getMonth() + 1 == req.params.month ));
   });
});

const LISTEN_PORT = 8080;

app.listen(LISTEN_PORT, () => {
   console.log('listening on port', LISTEN_PORT);
});
