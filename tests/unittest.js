'use strict';

/* Variables */
let allTestsPassed = true;

/* Asserting functions */
function assert (a, b) {
  if (a instanceof Array && b instanceof Array) {
    a.forEach((el, i) => {
      if (el instanceof Array) {
        assert(el, b[i]);
      }
      if (el !== b[i]) {
        console.error(`${a} (${typeof a}, i: ${i}) does not equals ${b} (${typeof b})`);
        allTestsPassed = false;
      }
    });
  } else {
    if (a !== b) {
      console.error(`${a} (${typeof a}) does not equals ${b} (${typeof b})`);
      allTestsPassed = false;
    }
  }
}

function shouldFail (fn) {
  try {
    fn();
    console.error(`function ${fn.name} did not fail`);
    allTestsPassed = false;
  } catch (_) {}
}

function shouldNotFail (fn) {
  try {
    fn();
  } catch (_) {
    console.error(`function ${fn.name} failed`);
    allTestsPassed = false;
  }
}

/* Test class */
class Test {
  constructor (fn, resetAfter = false) {
    this.fn = fn;
    this.reset = resetAfter;
    Test.tests.push(this);
  }

  run () {
    this.fn();
  }
}

Test.tests = [];

/* Tests */
/* |- Main script (neonflow.js) */
/* |- |- Checking if NeonFlow object exists */
new Test(() => {
  // Assert
  shouldNotFail(function neonflowExists () {
    NeonFlow;
  });
});
/* |- |- Checking if NeonFlow is static */
new Test(() => {
  // Assert
  shouldFail(function neonflowStatic () {
    new NeonFlow();
  });
});
/* |- |- Checking if import property exists */
new Test(() => {
  // Assert
  assert(NeonFlow.hasOwnProperty('import'), true);
});
/* |- |- Checking if import is a function */
new Test(() => {
  // Assert
  assert(typeof NeonFlow.import, 'function');
});
/* |- |- Checking if import is a read-only property */
new Test(() => {
  // Assert
  shouldFail(() => {
    NeonFlow.import = null;
  });
});
/* |- |- Checking if import is enumerable */
new Test(() => {
  // Assert
  assert(NeonFlow.propertyIsEnumerable('import'), true);
});
/* |- |- Checking if modulesDir property exists */
new Test(() => {
  // Assert
  assert(NeonFlow.hasOwnProperty('modulesDir'), true);
});
/* |- |- Checking if modulesDir property is a string */
new Test(() => {
  // Assert
  assert(typeof NeonFlow.modulesDir, 'string');
});
/* |- |- Checking if modulesDir property contains a default value */
new Test(() => {
  // Assert
  assert(!NeonFlow.modulesDir, false);
});
/* |- |- Checking if modulesDir property contains a valid default value */
new Test(() => {
  // Assert
  assert(!(NeonFlow.modulesDir.search(/.*[^\/]\/$/m) + 1), false);
});
/* |- |- Checking if modulesDir will always be a string */
new Test(() => {
  // Arrange
  let old = NeonFlow.modulesDir;

  // Act
  NeonFlow.modulesDir = null;

  // Assert
  assert(NeonFlow.modulesDir, old);
});
/* |- |- Checking if modulesDir will always be a valid string */
new Test(() => {
  // Arrange
  let old = NeonFlow.modulesDir;

  // Act
  NeonFlow.modulesDir = '//';

  // Assert
  assert(NeonFlow.modulesDir, old);
});
/* |- |- Checking if modulesDir property is enumerable */
new Test(() => {
  // Assert
  assert(NeonFlow.propertyIsEnumerable('modulesDir'), true);
});
/* |- |- Checking if MODULES_LIST constant property exists */
new Test(() => {
  // Assert
  assert(NeonFlow.hasOwnProperty('MODULES_LIST'), true);
});
/* |- |- Checking if MODULES_LIST property is constant */
new Test(() => {
  // Assert
  shouldFail(function modifyModulesClasses () {
    NeonFlow.MODULES_LIST = null;
  });
});
/* |- |- Checking if MODULES_LIST is enumerable */
new Test(() => {
  // Assert
  assert(NeonFlow.propertyIsEnumerable('MODULES_LIST'), true);
});
/* |- |- Checking if MODULES_LIST contains an array of strings */
new Test(() => {
  // Assert
  assert(NeonFlow.MODULES_LIST instanceof Array, true);
  assert(NeonFlow.MODULES_LIST.every((mod) => typeof mod === 'string'), true);
});
/* |- |- Checking if _chkTypes property exists */
new Test(() => {
  // Assert
  assert(NeonFlow.hasOwnProperty('_chkTypes'), true);
});
/* |- |- Checking if _chkTypes property is a function */
new Test(() => {
  // Assert
  assert(typeof NeonFlow._chkTypes, 'function');
});
/* |- |- Checking if _chkTypes property is read-only */
new Test(() => {
  // Assert
  shouldFail(function modifyChkTypes () {
    NeonFlow._chkTypes = null;
  });
});
/* |- |- Checking if modules property exists */
new Test(() => {
  // Assert
  assert(NeonFlow.hasOwnProperty('modules'), true);
});
/* |- |- Checking if modules property is an array of strings */
new Test(() => {
  // Assert
  assert(NeonFlow.modules instanceof Array, true);
  assert(NeonFlow.modules.every((mod) => typeof mod === 'string'), true);
});
/* |- |- Checking if modules property is enumerable */
new Test(() => {
  // Assert
  assert(NeonFlow.propertyIsEnumerable('modules'), true);
});
/* |- |- Checking if modules have a valid value */
new Test(() => {
  // Assert
  assert(NeonFlow.modules.every((mod) => NeonFlow.MODULES_LIST.includes(mod)), true);
});
/* |- |- Checking if modules will always have a valid value (non-existant module) */
new Test(() => {
  // Arrange
  let old = NeonFlow.modules;

  // Act
  NeonFlow.modules.push('thismodule/doesnotexist');

  // Assert
  assert(NeonFlow.modules, old);
});
/* |- |- Checking if modules will always have a valid value (invalid value: number) */
new Test(() => {
  // Arrange
  let old = NeonFlow.modules;

  // Act
  NeonFlow.modules.push(10);

  // Assert
  assert(NeonFlow.modules, old);
});
/* |- |- Checking if modules will always have a valid value (invalid value: null) */
new Test(() => {
  // Assert
  let old = NeonFlow.modules;

  // Act
  NeonFlow.modules = null;

  // Assert
  assert(NeonFlow.modules, old);
});
/* |- |- Checking if modules will always have a valid value (invalid value: number, array write) */
new Test(() => {
  // Assert
  let old = NeonFlow.modules;

  // Act
  NeonFlow.modules = [10];

  // Assert
  assert(NeonFlow.modules, old);
});

/* Running tests */
let neonflowScript = document.querySelector('script[src$="neonflow.js"]');
let unitTestScript = document.querySelector('script[src$="unittest.js"]');
Test.tests.forEach((test) => {
  test.run();
  if (test.reset) {
    document.querySelectorAll('script').forEach((el) => {
      if (el !== neonflowScript && el !== unitTestScript) {
        el.remove();
      }
    });
    document.querySelectorAll('body *').forEach((el) => {
      el.remove();
    });
  }
});

/* Checking if all tests passed */
if (allTestsPassed) {
  console.log(`All tests (${Test.tests.length}) passed !`);
} else {
  console.log('Some tests did not pass.');
}
