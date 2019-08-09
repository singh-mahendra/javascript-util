/* 
An async loop wrapper for javascript without using generators.
You can control the blocking time of the function.
This will take 2 arguments:
func: function Function to be called for each item.
allowedBlockingTime: Blocking time allowed per cycle.

Check the example below for usage.
*/

Array.prototype.forEachAsync = function(func, allowedTimeMs) {
    var arr = this;
    var now = Date.now();
    
    //Process items synchronously for allowed time.
    //After allowed time, move to asynchronous processing. 
    function processor(){
        if(arr.length === 0){
            return;
        }else{
            func(arr.shift());
            if(Date.now() < now + allowedTimeMs){
                return processor(arr);
            } else {
                now = Date.now();
                setTimeout(processor.bind(this), 0);
            }
        }
    }
    
    processor(arr);
};

/* Example usage*/

const myArray = [1,2,3,4,5,6];


var arr = [];
for(var i = 0; i< 100000; i++){
    arr.push(i);
}

//to be called for each item in the array
const myFunc = (item) => {
    let x = 0;
    for(let i = 0; i < 100000000; i++) {
        x = x + 1;
    }
    console.log(item, x);
}

//Maximum blocking allowed is 2 seconds.After 2 seconds, event loop will start pushing items on stack.
//After processing, loop will return to the previous item.
arr.forEachAsync(myFunc, 2000);


//to test async behaviour
var i = 0;
setInterval(function(){
    console.log(i++);
}, 10);
