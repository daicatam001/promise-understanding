const MyPromise = require('../index');

describe('test MyPromise', function () {
  it('executor was called after initialization', function () {
    let string;
    new MyPromise(() => {
      string = 'foo';
    });

    expect(string).toBe('foo');
  });
  it('resolution handler í called when promise is resolve', function () {
    const testString = 'foo';
    const promise = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(testString);
      });
    });
    promise.then((string) => {
      expect(string).toBe(testString);
    });
  });

  it('promise supports many resolutions', function () {
    const testString = 'foo';
    const promise = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(testString);
      }, 100);
    });
    promise.then((string) => {
      expect(string).toBe(testString);
    });
    promise.then((string) => {
      expect(string).toBe(testString);
    });
  });

  // hàm then luôn trả về 1 promise mới, promise sẽ resolve giá trị
  // return hàm them trước đó hoặc 1 giá trị đươc resolve từ
  // 1 promise trả về trong hàm then trước đó
  it('resolution handlers can be chained', function () {
    const testString = 'foo';
    const promise = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });

    promise
      .then(() => {
        return new MyPromise((resolve) => {
          setTimeout(() => {
            resolve(testString);
          });
        });
      })
      .then((string) => {
        expect(string).toBe(testString);
      });
  });
  it('chaining works with non-promise return values', function (done) {
    const testString = 'foo';

    const promise = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });

    promise
      .then(() => {
        return testString;
      })
      .then((string) => {
        expect(string).toBe(testString);
        done();
      });
  });
  it('resolution handlers can be attached when promise is resolved', function (done) {
    const testString = 'foo';
    const promise = new MyPromise((resolver) => {
      setTimeout(() => {
        resolver(testString);
      }, 100);
    });
    promise.then(function () {
      setTimeout(function () {
        promise.then(function (string) {
          expect(string).toBe(testString);
          done();
        });
      }, 100);
    });
  });
  it('calling resolve second time has no effect', function (done) {
    const testString = 'foo';
    const testString2 = 'bar';
    const promise = new MyPromise((resolve) => {
      setTimeout(function () {
        resolve(testString);
        resolve(testString2);
      }, 100);
    });
    promise.then(function (value) {
      expect(value).toBe(testString);
      setTimeout(function () {
        promise.then(function (value) {
          expect(value).toBe(testString);
          done();
        });
      }, 100);
    });
  });

  it('rejection handler is called when promise is rejected', function (done) {
    const testError = new Error('Something went wrong');

    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        reject(testError);
      }, 100);
    });

    promise.catch(function (value) {
      expect(value).toEqual(testError);
      done();
    });
  });
  it('rejections are passed downstream', function (done) {
    const testError = new Error('Something went wrong');

    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        reject(testError);
      }, 100);
    });

    promise
      .then(function (value) {
        return new MyPromise(function (resolve, reject) {
          setTimeout(function () {
            resolve('error');
          });
        });
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });
  it('rejecting promises returned from resolution handlers are caught properly', function (done) {
    const testError = new Error('Something went wrong');

    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 100);
    });

    promise
      .then(function (value) {
        return new MyPromise(function (resolve, reject) {
          setTimeout(function () {
            reject(testError);
          }, 100);
        });
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });

  it('rejection handlers catch synchronous errors in resolution handlers', function (done) {
    const testError = new Error('Something went wrong');

    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 100);
    });

    promise
      .then(function (value) {
        throw testError;
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });
  it('rejection handlers catch synchronous errors in the executor function', function (done) {
    const testError = new Error('Something went wrong');

    const promise = new MyPromise(function (resolve, reject) {
      throw testError;
    });

    promise
      .then(function (value) {
        return new MyPromise(function (resolve, reject) {
          setTimeout(function () {
            resolve();
          }, 100);
        });
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });

  it('rejection handler catch synchronous error', function (done) {
    const testError = new Error('Something went wrong');
    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 100);
    });

    promise
      .then(function (value) {
        throw new Error('some error');
      })
      .catch(function () {
        throw testError;
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });
  it('rejection promises returned from rejection handlers are caught', function (done) {
    const testError = new Error('Something went wrong');
    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 100);
    });

    promise
      .then(function (value) {
        throw new Error('some error');
      })
      .catch(function () {
        return new MyPromise(function (resolve, reject) {
          setTimeout(function () {
            reject(testError);
          }, 100);
        });
      })
      .catch(function (value) {
        expect(value).toEqual(testError);
        done();
      });
  });

  it('second argument in then is treated as a rejection handler', function (done) {
    const testError = new Error('Something went wrong');
    const promise = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        reject(testError);
      }, 100);
    });

    promise.then(
      function (value) {},
      function (e) {
        expect(e).toEqual(testError);
        done();
      }
    );
  });
});
