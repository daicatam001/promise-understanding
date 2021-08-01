const MyPromise = require('../index')

describe('test MyPromise',function(){
    it('executor was called after initialization', function(){
        let string;
        new MyPromise(()=>{
            string = 'foo'
        })

        expect(string).toBe('foo')
    })
    it('resolution handler í called when promise is resolve',function(){
       const testString ='foo';
       const promise = new MyPromise((resolve)=>{
           setTimeout(()=>{
                resolve(testString)
           })
       }) 
       promise.then((string)=>{
           expect(string).toBe(testString)
       })
    })

    it('promise supports many resolutions',function(){
        const testString ='foo';
        const promise = new MyPromise((resolve)=>{
            setTimeout(()=>{
                 resolve(testString)
            },100)
        }) 
        promise.then((string)=>{
            expect(string).toBe(testString)
        })
        promise.then((string)=>{
            expect(string).toBe(testString)
        })
    })

    // hàm then luôn trả về 1 promise mới, promise sẽ resolve giá trị
    // mà promise ban đầu đã resolve hoặc 1 giá trị đươc resolve từ 
    // 1 promise trả về trong hàm then trước đó
    it('resolution handlers can be chained',function(){
        const testString ='foo';
        const promise = new MyPromise((resolve)=>{
            setTimeout(()=>{
                 resolve()
            },100)
        })

        promise.then(()=>{
            return new MyPromise((resolve)=>{
                setTimeout(()=>{
                    resolve(testString)
                }) 
            })
        }).then((string)=>{
            expect(string).toBe(testString)
        })
    })
    it('chaining works with non-promise return values', function(){
        const  testString ='foo'
        
        const promise = new MyPromise((resolve)=>{
            setTimeout(()=>{
                 resolve()
            },100)
        })

        promise.then(()=>{
           return testString
        }).then((string)=>{
            expect(string).toBe(testString)
        })
    })
})