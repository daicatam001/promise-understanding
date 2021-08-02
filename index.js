class MyPromise {
  _resolutionQueue = [];
  _rejectionQueue = [];
  _value;
  _state = 'pending';
  _rejectionReason;

  constructor(executor) {
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }

  _runResolutionHandlers() {
    while (this._resolutionQueue.length > 0) {
      const resolution = this._resolutionQueue.shift();
      try {
        const returnValue = resolution.handler(this._value);
        if (returnValue && returnValue instanceof MyPromise) {
          returnValue
            .then((v) => {
              resolution.promise._resolve(v);
            })
            .catch((e) => {
              resolution.promise._reject(e);
            });
        } else {
          resolution.promise._resolve(returnValue);
        }
      } catch (e) {
        resolution.promise._reject(e);
      }
    }
  }

  _runRejectionHandlers() {
    while (this._rejectionQueue.length > 0) {
      const resolution = this._rejectionQueue.shift();
      try {
        const returnValue = resolution.handler(this._rejectionReason);
        if (returnValue && returnValue instanceof MyPromise) {
          returnValue
            .then((v) => {
              resolution.promise._resolve(v);
            })
            .catch((e) => {
              resolution.promise._reject(e);
            });
        } else {
          resolution.promise._resolve(returnValue);
        }
      } catch (e) {
        resolution.promise._reject(e);
      }
    }
  }

  _resolve(value) {
    if (this._state === 'pending') {
      this._value = value;
      this._state = 'resolved';
      this._runResolutionHandlers();
    }
  }

  _reject(reason) {
    if (this._state === 'pending') {
      this._rejectionReason = reason;
      this._state = 'rejected';
      this._runRejectionHandlers();
      while (this._resolutionQueue.length > 0) {
        const resolution = this._resolutionQueue.shift();
        resolution.promise._reject(this._rejectionReason);
      }
    }
  }

  then(callback, rejectionHandler) {
    const newPromise = new MyPromise(function () {});

    this._resolutionQueue.push({
      handler: callback,
      promise: newPromise,
    });
    if (typeof rejectionHandler === 'function') {
      this._rejectionQueue.push({
        handler: rejectionHandler,
        promise: newPromise,
      });
    }
    if (this._state === 'resolved') {
      this._runResolutionHandlers();
    }
    if (this._state === 'rejected') {
      newPromise._reject(this._rejectionReason);
    }
    return newPromise;
  }
  catch(callback) {
    const newPromise = new MyPromise(function () {});

    this._rejectionQueue.push({
      handler: callback,
      promise: newPromise,
    });
    if (this._state === 'rejected') {
      this._runRejectionHandlers();
    }
    return newPromise;
  }
}

// const bar = () => console.log('bar');
// const boo = () => console.log('boo');

// const foo = () => {
//   console.log('foo');
//   setTimeout(bar, 0);

//   new MyPromise((resolve) => {
//     resolve('far');
//   }).then((res) => console.log(res));

//   boo();
// };

// const foo1 = () => {
//   console.log('foo1');
//   setTimeout(bar, 0);

//   new Promise((resolve) => {
//     resolve('far');
//   }).then((res) => console.log(res));

//   boo();
// };

// foo();

// console.log('---------------------');

// foo1();
module.exports = MyPromise;
