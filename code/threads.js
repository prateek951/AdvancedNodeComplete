// process.env.UV_THREADPOOL_SIZE = 2;
//Can you predict the time taken by each pbkdf2 call to complete if
//threadpool size is 2 and the processor has 2 cores?

process.env.UV_THREADPOOL_SIZE = 5;
//Took nearly 3 seconds for all the pbkdf2 calls


// Is Node.js Single Threaded?
//Yes Node.js Single Threaded for methods that run in the event loop
//Some of the Node methods and its frameworks are not single threaded.

const crypto = require('crypto');

//Testing for Single Threads

//Time at which we start our call to the pbkdf2 function
//We are not modifying the start variable here in the code
const start = Date.now();

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
  //1073 seconds to run that pbkdf2 function
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
  //If we run the codes only upto this point 
  //Dont consider below calls
  //Output comes out to be
  // 1: 1150 seconds to run the pbkdf2 function
  // 2: 1159 seconds to run the second pbkdf2 functions
});

//The point is that if node were single threaded, then each of the above
//two calls should have take 1 sec each to complete (total 2s) which didn't
//happened

//Reality is that it took about 1 sec or little more for both the above 
//functions to get to the callback. It clearly indicates we are breaking
//out from the single thread setup.But why so ?

//In pbkdf2 method, Node actually uses other threads from the libuv thread 
//pool for doing computation intensive tasks which clearly indicates that 
//Node is not truly single threaded because if our method had been running
//in the event loop Node application would not have been doing anything 
//in the pbkdf2 function if it was truly single threaded.

//Detect the presence of the four threads in the thread pool

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5:', Date.now() - start);
});

//Concurrency of threads occur in case of all the five calls to pbkdf2
//due to hyperthreading/multithreading in CPU(allows to process 
//more than one thread at the same time)
//In this case each of the four separate pbkdf2 calls were assigned
//to different threads in thread pool

//Results for MacOS 2015 Pro Notebook (Dual core processor)

//Thread number 1 and Thread number 2 were assigned to Core 1
//Threads 3 and 4 were assigned to the core 2 
//Thanks to the multithreading our cores are able to process more than one 
//threads at the same time
//Each core has to do twice the amount of work in the same time
//which is why we saw in this case it took twice the time in calculating the
//hash values compared to the case of 2 pbkdf2 calls.

//Multithreading does not speed up the process.It just allows some concurrency
//as can be seen.

//Once all the four calls were done
//Fifth call to pbkdf2 will be executed which took only one second because
//for it the core was free at the time when its chance came but it had to 
//wait for a little over 2 seconds and then nearly 1 sec was taken to process
//the fifth pbkdf2 call.




