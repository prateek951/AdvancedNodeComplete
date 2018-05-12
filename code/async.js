//We are going to hit google.com multiple times to find how much time it took to get the response

const https = require('https');
const start = Date.now();

function doRequest(){

  https.request('https://www.google.com',res => {
    res.on('data',() => {});
    res.on('end',() => {
      console.log(Date.now() - start);
    });
  }).end();

}
//Run node async.js (nearly took 271ms for my first request)

doRequest(); //242
doRequest(); //249
doRequest(); //261
doRequest(); //262
doRequest(); //262
doRequest(); //273
doRequest(); //276

//We know threadpool has by default 4 threads so it is not making use of the thread pool
//Here we have 6 tasks(6 requests) all completed simultaneously.
//Libuv delegates the underlying request making to the OS to perform the super low level
//operations.Its the OS that does the real HTTPS request.libuv is used to issue request
//and it waits for OS to emit a signal that some response has come back to the request.
//There is no blocking of our JS code in eventloop or anything else in the JS application
//Everything is done by the OS itself and we are not touching the directpool at all in this case.

