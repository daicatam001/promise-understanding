class MyPromise{
    
    _callBackList=[]

    constructor(executor){
        executor(this.resolve.bind(this))    
    }

    resolve(value){
       while(this._callBackList.length > 0){
           const resolution = this._callBackList.shift()
           const returnValue = resolution.handler(value)

           if(returnValue && returnValue instanceof MyPromise){
               returnValue.then(v=>{
                   resolution.promise.resolve(v)
               })
           }else{
            resolution.promise.resolve(value)
           }
       }
    }

    then(callback){
        const newPromise = new MyPromise(function(){})

        this._callBackList.push({
            handler:callback,
            promise:newPromise
        })
        return newPromise;
    }

}

module.exports = MyPromise;