process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(Date.now() - start);
      });
    })
    .end();
}

function doHash(){
    
  crypto.pbkdf2('a','b',10000,512,'sha512',() => {
    console.log('Hash:',Date.now() - start);
  });

}

doRequest();

//Try to read everything in the multitask.js 

fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();

/****************OUTPUT********************/

// 291
// Hash: 2163
// FS: 2164    //FS should take practically negligible time since its a lowlevel call (core system call)
// Hash:2172
// Hash:2219
// Hash:2266

//This is the crazy node behaviour
//fs module makes use of the threadpool
//https modules makes use of OS

//We call fs.readFile
//Node gets some stats on the file (requires HD access), how large the file is
//HD accessed,state returned (one pause)
//Node requests to read the file
//HD accessed,file contents streamed back to the application (second big pause)
//Node returns the file contents to us






