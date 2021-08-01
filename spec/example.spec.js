const example = require('../example')
describe('test example.js',function(){
    it('sum function',function(){
      const  a = 1,b=2;
      const c = example.sum(a,b);
      expect(c).toBe(3)
    })
})

