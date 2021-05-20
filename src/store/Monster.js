function givePromise(label, ok){
	return new Promise((resolve, reject)=>{
  	setTimeout(()=>{
    	if(ok){ resolve(label + ': ok'); }
      else  { reject(label + ': err'); }
    }, 200);
  });
}

function ex11(){
	return Promise.resolve()
  	.then(()=>{
    	console.log('onFulfilled1 returns...');
    	return 'returned from onFulfilled1'; // -> value 
    })
    .then((value)=>{
    	console.log('onFulfilled2 got value:', value);
    });
}

function ex12(){
	return Promise.reject()
  	.catch(()=>{
    	console.log('onRejected1 returns...');
    	return 'returned from onRejected1';
    })
    .then((value)=>{
    	console.log('onFulfilled2 got value:', value);
    });
}

function ex2(){
	return Promise.reject()
  	.catch(()=>{
    	console.log('onRejected1 returns resolved promise');
    	return Promise.resolve('new promise value from onRejected1');
    })
    .then((value)=>{
    	console.log('onFulfilled2 got value:', value);
    });
}

function ex3(){
	return Promise.resolve()
  	.then(()=>{
    	console.log('onFulfilled1 throws');
      throw 'reason from onFulfilled1';
    })
    .catch((reason)=>{
    	console.log('onRejected1 got:', reason);
    });
}

function example1(){
	console.log('enter example1');
	return givePromise('promise 1', true)
  	.then(  // 1. STAGE
    	(value)=>{
    		console.log('1. onFulfill. value:', value);
        console.log('1. returning sync value');
        return "sync value from 1."
    	},
      (reason)=>{
      	console.log('1. onReject. reason:', reason);
      }
    )
    .then( // 2. STAGE
    	(value)=>{
    		console.log('2. onFulfill. value:', value);
        console.log('2. throwing exception');
				throw new Error('error from 2.')
    	},
      (reason)=>{
      	console.log('2. onReject. reason:', reason);
      }    
    )
    .then( // 3. STAGE
    	(value)=>{
    		console.log('3. onFulfill. value:', value);
    	},
      (reason)=>{
      	console.log('3. onReject. reason:', reason);
        console.log('3. no return (return undefined)')
      }    
    );
}

function example2(){
	console.log('\nEnter example2');
	return givePromise('promise 1', false)
  	.then(()=>{console.log('1. onFulfill')})
   	.then(()=>{console.log('2. onFulfill')})
    .catch((reason)=>{
    	console.log('3. onReject, reason: ', reason)
      console.log('3. Returning sync value');
      return 'value from catch 3'
     })
    .then((value)=>{
    	console.log('4. onFulfill after catch. value:', value);
    });
}

function example3(){
	console.log('\nEnter example 3');
  return givePromise('promise1', true)
  .then((value)=>{
  	console.log('1. onFulfill. value:', value);
    console.log('1. returning another promise');
    return givePromise('promise2', false);
  })
	.then(()=>{console.log('2. onFulfill')})
  .catch((reason)=>{
  	console.log('3. onReject. reason:', reason);
    console.log('3. throwing an error');
    throw new Error('error from onReject 2.');
  })
	.then(()=>{console.log('4. onFulfill')})
  .catch((reason)=>{
  	console.log('5. onReject. reason:', reason);
  });
}


console.clear();
ex11()
.then(ex12)
.then(ex2)
.then(ex3);
//example1()
//.then(example2)
//.then(example3); -->