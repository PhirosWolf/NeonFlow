'use strict';

let NeonFlow = {
  /* NeonFlow's version */
  'VERSION': '0.0.0',
  /* Path of the directory containing modules */
  'modulesDir': './modules/',
  /* Imported modules */
  'modules': [],
  /* List of modules that can be imported */
  'modulesList': [
    'data/block',
    'data/camera',
    'data/hitregion',
    'data/layer',
    'graphics/canvas',
    'graphics/gui',
    'graphics/tileset',
    'periph/mousehandler',
    'toolkits/graphics'
  ],
  /* Checks if the given array of modules are already imported */
  'chkDep': (deps) => deps.every((dep) => NeonFlow.modules.includes(dep)),
  'import': (query, callback) => {
    /* Count the number of scripts which are fully loaded */
    let queriesDoneCount = 0;
    /* Total modules to load */
    let lastQuery;

    /**
    * Shortcut function to create a script and appending it to the <head> element.
    * When all the scripts are loaded, the callback (given within this function's
    * arguments) is called.
    **/
    function createScript (src) {
      let script = document.createElement('script');
      script.defer = true;
      script.src = `${NeonFlow.modulesDir}${src}.js`;
      script.addEventListener('load', () => {
        ++queriesDoneCount;
        if (lastQuery === queriesDoneCount) {
          callback();
        }
      }, false);
      document.head.appendChild(script);
      NeonFlow.modules.push(src);
    }

    /**
    * If the query is "*" (which means all modules has to be imported),
    * all the modules are imported.
    * However, if the query doesn't contain a "/" (which means the user wants
    * to import a category of modules), then this category of modules is imported.
    * Otherwise, the scpecified module is imported.
    * (Queries trying to import modules which aren't in the modules list are not
    * imported)
    * Trying to import the same modules twice will just be ignored.
    **/
    let hasSlash = query.includes('/');
    if (query === '*') {
      let filteredModules = NeonFlow.modulesList.filter((modName) => !NeonFlow.modules.includes(modName));
      lastQuery = filteredModules.length;
      for (let modName of filteredModules) {
        createScript(modName);
      }
    } else if (!hasSlash) {
      let filteredModules = NeonFlow.modulesList.filter((modName) => modName.startsWith(query) && !NeonFlow.modules.includes(modName));
      lastQuery = filteredModules.length;
      for (let modName of filteredModules) {
        createScript(modName);
      }
    } else if (hasSlash && NeonFlow.modulesList.includes(query) && !NeonFlow.modules.includes(query)) {
      lastQuery = 1;
      createScript(query);
    }
  }
};
