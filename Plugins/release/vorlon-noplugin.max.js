/* jshint unused:false */
/* global base64_decode, CSSWizardView, window, console, jQuery */
(function(global) {
  'use strict';
  var fi = function() {

    this.cssImportStatements = [];
    this.cssKeyframeStatements = [];

    this.cssRegex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'gi');
    this.cssMediaQueryRegex = '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
    this.cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
    this.combinedCSSRegex = '((\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
    this.cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';
    this.cssImportStatementRegex = new RegExp('@import .*?;', 'gi');
  };

  /*
    Strip outs css comments and returns cleaned css string

    @param css, the original css string to be stipped out of comments

    @return cleanedCSS contains no css comments
  */
  fi.prototype.stripComments = function(cssString) {
    var regex = new RegExp(this.cssCommentsRegex, 'gi');

    return cssString.replace(regex, '');
  };

  /*
    Parses given css string, and returns css object
    keys as selectors and values are css rules
    eliminates all css comments before parsing

    @param source css string to be parsed

    @return object css
  */
  fi.prototype.parseCSS = function(source) {

    if (source === undefined) {
      return [];
    }

    var css = [];
    //strip out comments
    //source = this.stripComments(source);

    //get import statements

    while (true) {
      var imports = this.cssImportStatementRegex.exec(source);
      if (imports !== null) {
        this.cssImportStatements.push(imports[0]);
        css.push({
          selector: '@imports',
          type: 'imports',
          styles: imports[0]
        });
      } else {
        break;
      }
    }
    source = source.replace(this.cssImportStatementRegex, '');
    //get keyframe statements
    var keyframesRegex = new RegExp(this.cssKeyframeRegex, 'gi');
    var arr;
    while (true) {
      arr = keyframesRegex.exec(source);
      if (arr === null) {
        break;
      }
      css.push({
        selector: '@keyframes',
        type: 'keyframes',
        styles: arr[0]
      });
    }
    source = source.replace(keyframesRegex, '');

    //unified regex
    var unified = new RegExp(this.combinedCSSRegex, 'gi');

    while (true) {
      arr = unified.exec(source);
      if (arr === null) {
        break;
      }
      var selector = '';
      if (arr[2] === undefined) {
        selector = arr[5].split('\r\n').join('\n').trim();
      } else {
        selector = arr[2].split('\r\n').join('\n').trim();
      }

      /*
        fetch comments and associate it with current selector
      */
      var commentsRegex = new RegExp(this.cssCommentsRegex, 'gi');
      var comments = commentsRegex.exec(selector);
      if (comments !== null) {
        selector = selector.replace(commentsRegex, '').trim();
      }

      //determine the type
      if (selector.indexOf('@media') !== -1) {
        //we have a media query
        var cssObject = {
          selector: selector,
          type: 'media',
          subStyles: this.parseCSS(arr[3] + '\n}') //recursively parse media query inner css
        };
        if (comments !== null) {
          cssObject.comments = comments[0];
        }
        css.push(cssObject);
      } else {
        //we have standart css
        var rules = this.parseRules(arr[6]);
        var style = {
          selector: selector,
          rules: rules
        };
        if (selector === '@font-face') {
          style.type = 'font-face';
        }
        if (comments !== null) {
          style.comments = comments[0];
        }
        css.push(style);
      }
    }

    return css;
  };

  /*
    parses given string containing css directives
    and returns an array of objects containing ruleName:ruleValue pairs

    @param rules, css directive string example
        \n\ncolor:white;\n    font-size:18px;\n
  */
  fi.prototype.parseRules = function(rules) {
    //convert all windows style line endings to unix style line endings
    rules = rules.split('\r\n').join('\n');
    var ret = [];

    rules = rules.split(';');

    //proccess rules line by line
    for (var i = 0; i < rules.length; i++) {
      var line = rules[i];

      //determine if line is a valid css directive, ie color:white;
      line = line.trim();
      if (line.indexOf(':') !== -1) {
        //line contains :
        line = line.split(':');
        var cssDirective = line[0].trim();
        var cssValue = line.slice(1).join(':').trim();

        //more checks
        if (cssDirective.length < 1 || cssValue.length < 1) {
          continue; //there is no css directive or value that is of length 1 or 0
          // PLAIN WRONG WHAT ABOUT margin:0; ?
        }

        //push rule
        ret.push({
          directive: cssDirective,
          value: cssValue
        });
      } else {
        //if there is no ':', but what if it was mis splitted value which starts with base64
        if (line.trim().substr(0, 7) == 'base64,') { //hack :)
          ret[ret.length - 1].value += line.trim();
        } else {
          //add rule, even if it is defective
          if (line.length > 0) {
            ret.push({
              directive: '',
              value: line,
              defective: true
            });
          }
        }
      }
    }

    return ret; //we are done!
  };
  /*
    just returns the rule having given directive
    if not found returns false;
  */
  fi.prototype.findCorrespondingRule = function(rules, directive, value) {
    if (value === undefined) {
      value = false;
    }
    var ret = false;
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].directive == directive) {
        ret = rules[i];
        if (value === rules[i].value) {
          break;
        }
      }
    }
    return ret;
  };

  /*
      Finds styles that have given selector, compress them,
      and returns them
  */
  fi.prototype.findBySelector = function(cssObjectArray, selector, contains) {
    if (contains === undefined) {
      contains = false;
    }

    var found = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (contains === false) {
        if (cssObjectArray[i].selector === selector) {
          found.push(cssObjectArray[i]);
        }
      } else {
        if (cssObjectArray[i].selector.indexOf(selector) !== -1) {
          found.push(cssObjectArray[i]);
        }
      }

    }
    if (found.length < 2) {
      return found;
    } else {
      var base = found[0];
      for (i = 1; i < found.length; i++) {
        this.intelligentCSSPush([base], found[i]);
      }
      return [base]; //we are done!! all properties merged into base!
    }
  };

  /*
    deletes cssObjects having given selector, and returns new array
  */
  fi.prototype.deleteBySelector = function(cssObjectArray, selector) {
    var ret = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (cssObjectArray[i].selector !== selector) {
        ret.push(cssObjectArray[i]);
      }
    }
    return ret;
  };

  /*
      Compresses given cssObjectArray and tries to minimize
      selector redundence.
  */
  fi.prototype.compressCSS = function(cssObjectArray) {
    var compressed = [];
    var done = {};
    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];
      if (done[obj.selector] === true) {
        continue;
      }

      var found = this.findBySelector(cssObjectArray, obj.selector); //found compressed
      if (found.length !== 0) {
        compressed.push(found[0]);
        done[obj.selector] = true;
      }
    }
    return compressed;
  };

  /*
    Received 2 css objects with following structure
      {
        rules : [{directive:"", value:""}, {directive:"", value:""}, ...]
        selector : "SOMESELECTOR"
      }

    returns the changed(new,removed,updated) values on css1 parameter, on same structure

    if two css objects are the same, then returns false
      
      if a css directive exists in css1 and     css2, and its value is different, it is included in diff
      if a css directive exists in css1 and not css2, it is then included in diff
      if a css directive exists in css2 but not css1, then it is deleted in css1, it would be included in diff but will be marked as type='DELETED'

      @object css1 css object
      @object css2 css object

      @return diff css object contains changed values in css1 in regards to css2 see test input output in /test/data/css.js
  */
  fi.prototype.cssDiff = function(css1, css2) {
    if (css1.selector !== css2.selector) {
      return false;
    }

    //if one of them is media query return false, because diff function can not operate on media queries
    if ((css1.type === 'media' || css2.type === 'media')) {
      return false;
    }

    var diff = {
      selector: css1.selector,
      rules: []
    };
    var rule1, rule2;
    for (var i = 0; i < css1.rules.length; i++) {
      rule1 = css1.rules[i];
      //find rule2 which has the same directive as rule1
      rule2 = this.findCorrespondingRule(css2.rules, rule1.directive, rule1.value);
      if (rule2 === false) {
        //rule1 is a new rule in css1
        diff.rules.push(rule1);
      } else {
        //rule2 was found only push if its value is different too
        if (rule1.value !== rule2.value) {
          diff.rules.push(rule1);
        }
      }
    }

    //now for rules exists in css2 but not in css1, which means deleted rules
    for (var ii = 0; ii < css2.rules.length; ii++) {
      rule2 = css2.rules[ii];
      //find rule2 which has the same directive as rule1
      rule1 = this.findCorrespondingRule(css1.rules, rule2.directive);
      if (rule1 === false) {
        //rule1 is a new rule
        rule2.type = 'DELETED'; //mark it as a deleted rule, so that other merge operations could be true
        diff.rules.push(rule2);
      }
    }


    if (diff.rules.length === 0) {
      return false;
    }
    return diff;
  };

  /*
      Merges 2 different css objects together
      using intelligentCSSPush,

      @param cssObjectArray, target css object array
      @param newArray, source array that will be pushed into cssObjectArray parameter
      @param reverse, [optional], if given true, first parameter will be traversed on reversed order
              effectively giving priority to the styles in newArray
  */
  fi.prototype.intelligentMerge = function(cssObjectArray, newArray, reverse) {
    if (reverse === undefined) {
      reverse = false;
    }


    for (var i = 0; i < newArray.length; i++) {
      this.intelligentCSSPush(cssObjectArray, newArray[i], reverse);
    }
    for (i = 0; i < cssObjectArray.length; i++) {
      var cobj = cssObjectArray[i];
      if (cobj.type === 'media' ||  (cobj.type === 'keyframes')) {
        continue;
      }
      cobj.rules = this.compactRules(cobj.rules);
    }
  };

  /*
    inserts new css objects into a bigger css object
    with same selectors groupped together

    @param cssObjectArray, array of bigger css object to be pushed into
    @param minimalObject, single css object
    @param reverse [optional] default is false, if given, cssObjectArray will be reversly traversed
            resulting more priority in minimalObject's styles
  */
  fi.prototype.intelligentCSSPush = function(cssObjectArray, minimalObject, reverse) {
    var pushSelector = minimalObject.selector;
    //find correct selector if not found just push minimalObject into cssObject
    var cssObject = false;

    if (reverse === undefined) {
      reverse = false;
    }

    if (reverse === false) {
      for (var i = 0; i < cssObjectArray.length; i++) {
        if (cssObjectArray[i].selector === minimalObject.selector) {
          cssObject = cssObjectArray[i];
          break;
        }
      }
    } else {
      for (var j = cssObjectArray.length - 1; j > -1; j--) {
        if (cssObjectArray[j].selector === minimalObject.selector) {
          cssObject = cssObjectArray[j];
          break;
        }
      }
    }

    if (cssObject === false) {
      cssObjectArray.push(minimalObject); //just push, because cssSelector is new
    } else {
      if (minimalObject.type !== 'media') {
        for (var ii = 0; ii < minimalObject.rules.length; ii++) {
          var rule = minimalObject.rules[ii];
          //find rule inside cssObject
          var oldRule = this.findCorrespondingRule(cssObject.rules, rule.directive);
          if (oldRule === false) {
            cssObject.rules.push(rule);
          } else if (rule.type == 'DELETED') {
            oldRule.type = 'DELETED';
          } else {
            //rule found just update value

            oldRule.value = rule.value;
          }
        }
      } else {
        cssObject.subStyles = minimalObject.subStyles; //TODO, make this intelligent too
      }

    }
  };

  /*
    filter outs rule objects whose type param equal to DELETED

    @param rules, array of rules

    @returns rules array, compacted by deleting all unneccessary rules
  */
  fi.prototype.compactRules = function(rules) {
    var newRules = [];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].type !== 'DELETED') {
        newRules.push(rules[i]);
      }
    }
    return newRules;
  };
  /*
    computes string for ace editor using this.css or given cssBase optional parameter

    @param [optional] cssBase, if given computes cssString from cssObject array
  */
  fi.prototype.getCSSForEditor = function(cssBase, depth) {
    if (depth === undefined) {
      depth = 0;
    }
    var ret = '';
    if (cssBase === undefined) {
      cssBase = this.css;
    }
    //append imports
    for (var i = 0; i < cssBase.length; i++) {
      if (cssBase[i].type == 'imports') {
        ret += cssBase[i].styles + '\n\n';
      }
    }
    for (i = 0; i < cssBase.length; i++) {
      var tmp = cssBase[i];
      if (tmp.selector === undefined) { //temporarily omit media queries
        continue;
      }
      var comments = "";
      if (tmp.comments !== undefined) {
        comments = tmp.comments + '\n';
      }

      if (tmp.type == 'media') { //also put media queries to output
        ret += comments + tmp.selector + '{\n';
        ret += this.getCSSForEditor(tmp.subStyles, depth + 1);
        ret += '}\n\n';
      } else if (tmp.type !== 'keyframes' && tmp.type !== 'imports') {
        ret += this.getSpaces(depth) + comments + tmp.selector + ' {\n';
        ret += this.getCSSOfRules(tmp.rules, depth + 1);
        ret += this.getSpaces(depth) + '}\n\n';
      }
    }

    //append keyFrames
    for (i = 0; i < cssBase.length; i++) {
      if (cssBase[i].type == 'keyframes') {
        ret += cssBase[i].styles + '\n\n';
      }
    }

    return ret;
  };

  fi.prototype.getImports = function(cssObjectArray) {
    var imps = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (cssObjectArray[i].type == 'imports') {
        imps.push(cssObjectArray[i].styles);
      }
    }
    return imps;
  };
  /*
    given rules array, returns visually formatted css string
    to be used inside editor
  */
  fi.prototype.getCSSOfRules = function(rules, depth) {
    var ret = '';
    for (var i = 0; i < rules.length; i++) {
      if (rules[i] === undefined) {
        continue;
      }
      if (rules[i].defective === undefined) {
        ret += this.getSpaces(depth) + rules[i].directive + ' : ' + rules[i].value + ';\n';
      } else {
        ret += this.getSpaces(depth) + rules[i].value + ';\n';
      }

    }
    return ret || '\n';
  };

  /*
      A very simple helper function returns number of spaces appended in a single string,
      the number depends input parameter, namely input*2
  */
  fi.prototype.getSpaces = function(num) {
    var ret = '';
    for (var i = 0; i < num * 4; i++) {
      ret += ' ';
    }
    return ret;
  };

  /*
    Given css string or objectArray, parses it and then for every selector,
    prepends this.cssPreviewNamespace to prevent css collision issues

    @returns css string in which this.cssPreviewNamespace prepended
  */
  fi.prototype.applyNamespacing = function(css, forcedNamespace) {
    var cssObjectArray = css;
    var namespaceClass = '.' + this.cssPreviewNamespace;
    if(forcedNamespace !== undefined){
      namespaceClass = forcedNamespace;
    }

    if (typeof css === 'string') {
      cssObjectArray = this.parseCSS(css);
    }

    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];

      //bypass namespacing for @font-face @keyframes @import
      if(obj.selector.indexOf('@font-face') > -1 || obj.selector.indexOf('keyframes') > -1 || obj.selector.indexOf('@import') > -1 || obj.selector.indexOf('.form-all') > -1 || obj.selector.indexOf('#stage') > -1){
        continue;
      }

      if (obj.type !== 'media') {
        var selector = obj.selector.split(',');
        var newSelector = [];
        for (var j = 0; j < selector.length; j++) {
          if (selector[j].indexOf('.supernova') === -1) { //do not apply namespacing to selectors including supernova
            newSelector.push(namespaceClass + ' ' + selector[j]);
          } else {
            newSelector.push(selector[j]);
          }
        }
        obj.selector = newSelector.join(',');
      } else {
        obj.subStyles = this.applyNamespacing(obj.subStyles, forcedNamespace); //handle media queries as well
      }
    }

    return cssObjectArray;
  };

  /*
    given css string or object array, clears possible namespacing from
    all of the selectors inside the css
  */
  fi.prototype.clearNamespacing = function(css, returnObj) {
    if (returnObj === undefined) {
      returnObj = false;
    }
    var cssObjectArray = css;
    var namespaceClass = '.' + this.cssPreviewNamespace;
    if (typeof css === 'string') {
      cssObjectArray = this.parseCSS(css);
    }

    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];

      if (obj.type !== 'media') {
        var selector = obj.selector.split(',');
        var newSelector = [];
        for (var j = 0; j < selector.length; j++) {
          newSelector.push(selector[j].split(namespaceClass + ' ').join(''));
        }
        obj.selector = newSelector.join(',');
      } else {
        obj.subStyles = this.clearNamespacing(obj.subStyles, true); //handle media queries as well
      }
    }
    if (returnObj === false) {
      return this.getCSSForEditor(cssObjectArray);
    } else {
      return cssObjectArray;
    }

  };

  /*
    creates a new style tag (also destroys the previous one)
    and injects given css string into that css tag
  */
  fi.prototype.createStyleElement = function(id, css, format) {
    if (format === undefined) {
      format = false;
    }

    if (this.testMode === false && format!=='nonamespace') {
      //apply namespacing classes
      css = this.applyNamespacing(css);
    }

    if (typeof css != 'string') {
      css = this.getCSSForEditor(css);
    }
    //apply formatting for css
    if (format === true) {
      css = this.getCSSForEditor(this.parseCSS(css));
    }

    if (this.testMode !== false) {
      return this.testMode('create style #' + id, css); //if test mode, just pass result to callback
    }

    var __el = document.getElementById( id );
    if(__el){
      __el.parentNode.removeChild( __el );  
    }

    var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.id = id;
    style.type = 'text/css';

    head.appendChild(style);

    if (style.styleSheet && !style.sheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  };

  global.cssjs = fi;

})(this);

var VORLON;
(function (VORLON) {
    var Tools = (function () {
        function Tools() {
        }
        Object.defineProperty(Tools, "IsWindowAvailable", {
            get: function () {
                return typeof window != 'undefined';
            },
            enumerable: true,
            configurable: true
        });
        Tools.QuerySelectorById = function (root, id) {
            if (root.querySelector) {
                return root.querySelector("#" + id);
            }
            return document.getElementById(id);
        };
        Tools.SetImmediate = function (func) {
            if (window.setImmediate) {
                setImmediate(func);
            }
            else {
                setTimeout(func, 0);
            }
        };
        Tools.setLocalStorageValue = function (key, data) {
            if (localStorage) {
                try {
                    localStorage.setItem(key, data);
                }
                catch (e) {
                }
            }
        };
        Tools.getLocalStorageValue = function (key) {
            if (localStorage) {
                try {
                    return localStorage.getItem(key);
                }
                catch (e) {
                    //local storage is not available (private mode maybe)
                    return "";
                }
            }
        };
        Tools.Hook = function (rootObject, functionToHook, hookingFunction) {
            var previousFunction = rootObject[functionToHook];
            rootObject[functionToHook] = function () {
                var optionalParams = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    optionalParams[_i - 0] = arguments[_i];
                }
                hookingFunction(optionalParams);
                previousFunction.apply(rootObject, optionalParams);
            };
            return previousFunction;
        };
        Tools.HookProperty = function (rootObjectName, propertyToHook, callback) {
            var rootObject = (Tools.IsWindowAvailable ? window : global)[rootObjectName];
            var initialValue = rootObject[propertyToHook];
            Object.defineProperty(rootObject, propertyToHook, {
                get: function () {
                    if (callback) {
                        var stack = VORLON.Tools.getCallStack(1);
                        stack.property = propertyToHook;
                        callback(stack);
                    }
                    return initialValue;
                }
            });
        };
        Tools.getCallStack = function (skipped) {
            skipped = skipped || 0;
            try {
                //Throw an error to generate a stack trace
                throw new Error();
            }
            catch (e) {
                //Split the stack trace into each line
                var stackLines = e.stack.split('\n');
                var callerIndex = 0;
                //Now walk though each line until we find a path reference
                for (var i = 2 + skipped, l = stackLines.length; i < l; i++) {
                    if (!(stackLines[i].indexOf("http://") >= 0))
                        continue;
                    //We skipped all the lines with out an http so we now have a script reference
                    //This one is the class constructor, the next is the getScriptPath() call
                    //The one after that is the user code requesting the path info (so offset by 2)
                    callerIndex = i;
                    break;
                }
                var res = {
                    stack: e.stack,
                };
                var linetext = stackLines[callerIndex];
                //Now parse the string for each section we want to return
                //var pathParts = linetext.match(/((http[s]?:\/\/.+\/)([^\/]+\.js))([\/]):/);
                // if (pathParts){
                //     
                // }
                var opening = linetext.indexOf("http://") || linetext.indexOf("https://");
                if (opening > 0) {
                    var closing = linetext.indexOf(")", opening);
                    if (closing < 0)
                        closing = linetext.length - 1;
                    var filename = linetext.substr(opening, closing - opening);
                    var linestart = filename.indexOf(":", filename.lastIndexOf("/"));
                    res.file = filename.substr(0, linestart);
                    res.line = filename.substr(linestart + 1);
                }
                return res;
            }
        };
        Tools.CreateCookie = function (name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        };
        Tools.ReadCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return "";
        };
        // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
        Tools.CreateGUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        Tools.RemoveEmpties = function (arr) {
            var len = arr.length;
            for (var i = len - 1; i >= 0; i--) {
                if (!arr[i]) {
                    arr.splice(i, 1);
                    len--;
                }
            }
            return len;
        };
        Tools.AddClass = function (e, name) {
            if (e.classList) {
                if (name.indexOf(" ") < 0) {
                    e.classList.add(name);
                }
                else {
                    var namesToAdd = name.split(" ");
                    Tools.RemoveEmpties(namesToAdd);
                    for (var i = 0, len = namesToAdd.length; i < len; i++) {
                        e.classList.add(namesToAdd[i]);
                    }
                }
                return e;
            }
            else {
                var className = e.className;
                var names = className.split(" ");
                var l = Tools.RemoveEmpties(names);
                var toAdd;
                if (name.indexOf(" ") >= 0) {
                    namesToAdd = name.split(" ");
                    Tools.RemoveEmpties(namesToAdd);
                    for (i = 0; i < l; i++) {
                        var found = namesToAdd.indexOf(names[i]);
                        if (found >= 0) {
                            namesToAdd.splice(found, 1);
                        }
                    }
                    if (namesToAdd.length > 0) {
                        toAdd = namesToAdd.join(" ");
                    }
                }
                else {
                    var saw = false;
                    for (i = 0; i < l; i++) {
                        if (names[i] === name) {
                            saw = true;
                            break;
                        }
                    }
                    if (!saw) {
                        toAdd = name;
                    }
                }
                if (toAdd) {
                    if (l > 0 && names[0].length > 0) {
                        e.className = className + " " + toAdd;
                    }
                    else {
                        e.className = toAdd;
                    }
                }
                return e;
            }
        };
        Tools.RemoveClass = function (e, name) {
            if (e.classList) {
                if (e.classList.length === 0) {
                    return e;
                }
                var namesToRemove = name.split(" ");
                Tools.RemoveEmpties(namesToRemove);
                for (var i = 0, len = namesToRemove.length; i < len; i++) {
                    e.classList.remove(namesToRemove[i]);
                }
                return e;
            }
            else {
                var original = e.className;
                if (name.indexOf(" ") >= 0) {
                    namesToRemove = name.split(" ");
                    Tools.RemoveEmpties(namesToRemove);
                }
                else {
                    if (original.indexOf(name) < 0) {
                        return e;
                    }
                    namesToRemove = [name];
                }
                var removed;
                var names = original.split(" ");
                var namesLen = Tools.RemoveEmpties(names);
                for (i = namesLen - 1; i >= 0; i--) {
                    if (namesToRemove.indexOf(names[i]) >= 0) {
                        names.splice(i, 1);
                        removed = true;
                    }
                }
                if (removed) {
                    e.className = names.join(" ");
                }
                return e;
            }
        };
        Tools.ToggleClass = function (e, name, callback) {
            if (e.className.match(name)) {
                Tools.RemoveClass(e, name);
                if (callback)
                    callback(false);
            }
            else {
                Tools.AddClass(e, name);
                if (callback)
                    callback(true);
            }
        };
        Tools.htmlToString = function (text) {
            return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };
        return Tools;
    }());
    VORLON.Tools = Tools;
    var FluentDOM = (function () {
        function FluentDOM(nodeType, className, parentElt, parent) {
            this.childs = [];
            if (nodeType) {
                this.element = document.createElement(nodeType);
                if (className)
                    this.element.className = className;
                if (parentElt)
                    parentElt.appendChild(this.element);
                this.parent = parent;
                if (parent) {
                    parent.childs.push(this);
                }
            }
        }
        FluentDOM.forElement = function (element) {
            var res = new FluentDOM(null);
            res.element = element;
            return res;
        };
        FluentDOM.prototype.addClass = function (classname) {
            this.element.classList.add(classname);
            return this;
        };
        FluentDOM.prototype.toggleClass = function (classname) {
            this.element.classList.toggle(classname);
            return this;
        };
        FluentDOM.prototype.className = function (classname) {
            this.element.className = classname;
            return this;
        };
        FluentDOM.prototype.opacity = function (opacity) {
            this.element.style.opacity = opacity;
            return this;
        };
        FluentDOM.prototype.display = function (display) {
            this.element.style.display = display;
            return this;
        };
        FluentDOM.prototype.hide = function () {
            this.element.style.display = 'none';
            return this;
        };
        FluentDOM.prototype.visibility = function (visibility) {
            this.element.style.visibility = visibility;
            return this;
        };
        FluentDOM.prototype.text = function (text) {
            this.element.textContent = text;
            return this;
        };
        FluentDOM.prototype.html = function (text) {
            this.element.innerHTML = text;
            return this;
        };
        FluentDOM.prototype.attr = function (name, val) {
            this.element.setAttribute(name, val);
            return this;
        };
        FluentDOM.prototype.editable = function (editable) {
            this.element.contentEditable = editable ? "true" : "false";
            return this;
        };
        FluentDOM.prototype.style = function (name, val) {
            this.element.style[name] = val;
            return this;
        };
        FluentDOM.prototype.appendTo = function (elt) {
            elt.appendChild(this.element);
            return this;
        };
        FluentDOM.prototype.append = function (nodeType, className, callback) {
            var child = new FluentDOM(nodeType, className, this.element, this);
            if (callback) {
                callback(child);
            }
            return this;
        };
        FluentDOM.prototype.createChild = function (nodeType, className) {
            var child = new FluentDOM(nodeType, className, this.element, this);
            return child;
        };
        FluentDOM.prototype.click = function (callback) {
            this.element.addEventListener('click', callback);
            return this;
        };
        FluentDOM.prototype.blur = function (callback) {
            this.element.addEventListener('blur', callback);
            return this;
        };
        FluentDOM.prototype.keydown = function (callback) {
            this.element.addEventListener('keydown', callback);
            return this;
        };
        return FluentDOM;
    }());
    VORLON.FluentDOM = FluentDOM;
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    (function (RuntimeSide) {
        RuntimeSide[RuntimeSide["Client"] = 0] = "Client";
        RuntimeSide[RuntimeSide["Dashboard"] = 1] = "Dashboard";
        RuntimeSide[RuntimeSide["Both"] = 2] = "Both";
    })(VORLON.RuntimeSide || (VORLON.RuntimeSide = {}));
    var RuntimeSide = VORLON.RuntimeSide;
    (function (PluginType) {
        PluginType[PluginType["OneOne"] = 0] = "OneOne";
        PluginType[PluginType["MulticastReceiveOnly"] = 1] = "MulticastReceiveOnly";
        PluginType[PluginType["Multicast"] = 2] = "Multicast";
    })(VORLON.PluginType || (VORLON.PluginType = {}));
    var PluginType = VORLON.PluginType;
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var BasePlugin = (function () {
        function BasePlugin(name) {
            this.name = name;
            this._ready = true;
            this._id = "";
            this._type = VORLON.PluginType.OneOne;
            this.traceLog = function (msg) { console.log(msg); };
            this.traceNoop = function (msg) { };
            this.loadingDirectory = "vorlon/plugins";
            this.debug = VORLON.Core.debug;
        }
        Object.defineProperty(BasePlugin.prototype, "Type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasePlugin.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (val) {
                this._debug = val;
                if (val) {
                    this.trace = this.traceLog;
                }
                else {
                    this.trace = this.traceNoop;
                }
            },
            enumerable: true,
            configurable: true
        });
        BasePlugin.prototype.getID = function () {
            return this._id;
        };
        BasePlugin.prototype.isReady = function () {
            return this._ready;
        };
        return BasePlugin;
    }());
    VORLON.BasePlugin = BasePlugin;
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var ClientPlugin = (function (_super) {
        __extends(ClientPlugin, _super);
        function ClientPlugin(name) {
            _super.call(this, name);
        }
        ClientPlugin.prototype.startClientSide = function () { };
        ClientPlugin.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) { };
        ClientPlugin.prototype.sendToDashboard = function (data) {
            if (VORLON.Core.Messenger)
                VORLON.Core.Messenger.sendRealtimeMessage(this.getID(), data, VORLON.RuntimeSide.Client, "message");
        };
        ClientPlugin.prototype.sendCommandToDashboard = function (command, data) {
            if (data === void 0) { data = null; }
            if (VORLON.Core.Messenger) {
                this.trace(this.getID() + ' send command to dashboard ' + command);
                VORLON.Core.Messenger.sendRealtimeMessage(this.getID(), data, VORLON.RuntimeSide.Client, "message", command);
            }
        };
        ClientPlugin.prototype.refresh = function () {
            console.error("Please override plugin.refresh()");
        };
        ClientPlugin.prototype._loadNewScriptAsync = function (scriptName, callback, waitForDOMContentLoaded) {
            var _this = this;
            var basedUrl = "";
            if (this.loadingDirectory.indexOf('http') === 0) {
                if (scriptName[0] == "/") {
                    basedUrl = "";
                }
                else {
                    basedUrl = this.loadingDirectory + "/" + this.name + "/";
                }
            }
            else {
                if (scriptName[0] == "/") {
                    basedUrl = vorlonBaseURL;
                }
                else {
                    basedUrl = vorlonBaseURL + "/" + this.loadingDirectory + "/" + this.name + "/";
                }
            }
            if (VORLON.Core.IsHttpsEnabled && basedUrl.indexOf('https://') === -1) {
                basedUrl = basedUrl.replace(/^http/, "https");
            }
            function loadScript() {
                var scriptToLoad = document.createElement("script");
                scriptToLoad.setAttribute("src", basedUrl + scriptName);
                scriptToLoad.onload = callback;
                var first = document.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(scriptToLoad, first);
            }
            if (!waitForDOMContentLoaded || document.body) {
                loadScript();
            }
            else {
                document.addEventListener("DOMContentLoaded", function () {
                    _this._loadNewScriptAsync(scriptName, callback, waitForDOMContentLoaded);
                });
            }
        };
        return ClientPlugin;
    }(VORLON.BasePlugin));
    VORLON.ClientPlugin = ClientPlugin;
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var DashboardPlugin = (function (_super) {
        __extends(DashboardPlugin, _super);
        function DashboardPlugin(name, htmlFragmentUrl, cssStyleSheetUrl, JavascriptSheetUrl) {
            _super.call(this, name);
            this.htmlFragmentUrl = htmlFragmentUrl;
            this.cssStyleSheetUrl = (cssStyleSheetUrl instanceof Array) ? cssStyleSheetUrl : (typeof cssStyleSheetUrl === 'undefined') ? [] : [cssStyleSheetUrl];
            this.JavascriptSheetUrl = (JavascriptSheetUrl instanceof Array) ? JavascriptSheetUrl : (typeof JavascriptSheetUrl === 'undefined') ? [] : [JavascriptSheetUrl];
            this.debug = VORLON.Core.debug;
        }
        DashboardPlugin.prototype.startDashboardSide = function (div) { };
        DashboardPlugin.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) { };
        DashboardPlugin.prototype.sendToClient = function (data) {
            if (VORLON.Core.Messenger)
                VORLON.Core.Messenger.sendRealtimeMessage(this.getID(), data, VORLON.RuntimeSide.Dashboard, "message");
        };
        DashboardPlugin.prototype.sendCommandToClient = function (command, data) {
            if (data === void 0) { data = null; }
            if (VORLON.Core.Messenger) {
                this.trace(this.getID() + ' send command to client ' + command);
                VORLON.Core.Messenger.sendRealtimeMessage(this.getID(), data, VORLON.RuntimeSide.Dashboard, "message", command);
            }
        };
        DashboardPlugin.prototype.sendCommandToPluginClient = function (pluginId, command, data) {
            if (data === void 0) { data = null; }
            if (VORLON.Core.Messenger) {
                this.trace(this.getID() + ' send command to plugin client ' + command);
                VORLON.Core.Messenger.sendRealtimeMessage(pluginId, data, VORLON.RuntimeSide.Dashboard, "protocol", command);
            }
        };
        DashboardPlugin.prototype.sendCommandToPluginDashboard = function (pluginId, command, data) {
            if (data === void 0) { data = null; }
            if (VORLON.Core.Messenger) {
                this.trace(this.getID() + ' send command to plugin dashboard ' + command);
                VORLON.Core.Messenger.sendRealtimeMessage(pluginId, data, VORLON.RuntimeSide.Client, "protocol", command);
            }
        };
        DashboardPlugin.prototype._insertHtmlContentAsync = function (divContainer, callback) {
            var _this = this;
            var basedUrl = vorlonBaseURL + "/" + this.loadingDirectory + "/" + this.name + "/";
            var alone = false;
            if (!divContainer) {
                // Not emptyDiv provided, let's plug into the main DOM
                divContainer = document.createElement("div");
                document.body.appendChild(divContainer);
                alone = true;
            }
            var request = new XMLHttpRequest();
            request.open('GET', basedUrl + this.htmlFragmentUrl, true);
            request.onreadystatechange = function (ev) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var headID = document.getElementsByTagName("head")[0];
                        for (var i = 0; i < _this.cssStyleSheetUrl.length; i++) {
                            var cssNode = document.createElement('link');
                            cssNode.type = "text/css";
                            cssNode.rel = "stylesheet";
                            cssNode.href = basedUrl + _this.cssStyleSheetUrl[i];
                            cssNode.media = "screen";
                            headID.appendChild(cssNode);
                        }
                        for (var i = 0; i < _this.JavascriptSheetUrl.length; i++) {
                            var jsNode = document.createElement('script');
                            jsNode.type = "text/javascript";
                            jsNode.src = basedUrl + _this.JavascriptSheetUrl[i];
                            headID.appendChild(jsNode);
                        }
                        divContainer.innerHTML = _this._stripContent(request.responseText);
                        if ($(divContainer).find('.split').length && $(divContainer).find('.split').is(":visible") && !$(divContainer).find('.vsplitter').length) {
                            $(divContainer).find('.split').split({
                                orientation: $(divContainer).find('.split').data('orientation'),
                                limit: $(divContainer).find('.split').data('limit'),
                                position: $(divContainer).find('.split').data('position'),
                            });
                        }
                        var firstDivChild = (divContainer.children[0]);
                        if (alone) {
                            firstDivChild.className = "alone";
                        }
                        callback(firstDivChild);
                    }
                    else {
                        throw new Error("Error status: " + request.status + " - Unable to load " + basedUrl + _this.htmlFragmentUrl);
                    }
                }
            };
            request.send(null);
        };
        DashboardPlugin.prototype._stripContent = function (content) {
            // in case of SVG injection
            var xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im;
            // for HTML content
            var bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            }
            return content;
        };
        return DashboardPlugin;
    }(VORLON.BasePlugin));
    VORLON.DashboardPlugin = DashboardPlugin;
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var ClientMessenger = (function () {
        function ClientMessenger(side, serverUrl, sessionId, clientId, listenClientId) {
            var _this = this;
            this._isConnected = false;
            this._isConnected = false;
            this._sessionId = sessionId;
            this._clientId = clientId;
            VORLON.Core._listenClientId = listenClientId;
            this._serverUrl = serverUrl;
            var options = {
                "path": serverUrl.replace(/h.*:\/\/[^\/]*/, "") + "/socket.io"
            };
            switch (side) {
                case VORLON.RuntimeSide.Client:
                    this._socket = io.connect(serverUrl + "/client", options);
                    this._isConnected = true;
                    break;
                case VORLON.RuntimeSide.Dashboard:
                    this._socket = io.connect(serverUrl + "/dashboard", options);
                    this._isConnected = true;
                    break;
            }
            if (this.isConnected) {
                var manager = io.Manager(serverUrl, options);
                manager.on('connect_error', function (err) {
                    if (_this.onError) {
                        _this.onError(err);
                    }
                });
                this._socket.on('message', function (message) {
                    var received = JSON.parse(message);
                    if (_this.onRealtimeMessageReceived) {
                        _this.onRealtimeMessageReceived(received);
                    }
                });
                this._socket.on('helo', function (message) {
                    //console.log('messenger helo', message);
                    VORLON.Core._listenClientId = message;
                    if (_this.onHeloReceived) {
                        _this.onHeloReceived(message);
                    }
                });
                this._socket.on('identify', function (message) {
                    //console.log('messenger identify', message);
                    if (_this.onIdentifyReceived) {
                        _this.onIdentifyReceived(message);
                    }
                });
                this._socket.on('stoplisten', function () {
                    if (_this.onStopListenReceived) {
                        _this.onStopListenReceived();
                    }
                });
                this._socket.on('refreshclients', function () {
                    //console.log('messenger refreshclients');
                    if (_this.onRefreshClients) {
                        _this.onRefreshClients();
                    }
                });
                this._socket.on('addclient', function (client) {
                    //console.log('messenger refreshclients');
                    if (_this.onAddClient) {
                        _this.onAddClient(client);
                    }
                });
                this._socket.on('removeclient', function (client) {
                    console.log('messenger refreshclients');
                    if (_this.onRemoveClient) {
                        _this.onRemoveClient(client);
                    }
                });
                this._socket.on('reload', function (message) {
                    //console.log('messenger reloadclient', message);
                    VORLON.Core._listenClientId = message;
                    if (_this.onReload) {
                        _this.onReload(message);
                    }
                });
            }
        }
        Object.defineProperty(ClientMessenger.prototype, "isConnected", {
            get: function () {
                return this._isConnected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientMessenger.prototype, "clientId", {
            set: function (value) {
                this._clientId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientMessenger.prototype, "socketId", {
            get: function () {
                return this._socket.id;
            },
            enumerable: true,
            configurable: true
        });
        ClientMessenger.prototype.stopListening = function () {
            if (this._socket) {
                this._socket.removeAllListeners();
            }
        };
        ClientMessenger.prototype.sendRealtimeMessage = function (pluginID, objectToSend, side, messageType, command) {
            if (messageType === void 0) { messageType = "message"; }
            var message = {
                metadata: {
                    pluginID: pluginID,
                    side: side,
                    sessionId: this._sessionId,
                    clientId: this._clientId,
                    listenClientId: VORLON.Core._listenClientId
                },
                data: objectToSend
            };
            if (command)
                message.command = command;
            if (!this.isConnected) {
                // Directly raise response locally
                if (this.onRealtimeMessageReceived) {
                    this.onRealtimeMessageReceived(message);
                }
                return;
            }
            else {
                if (VORLON.Core._listenClientId !== "" || messageType !== "message") {
                    var strmessage = JSON.stringify(message);
                    this._socket.emit(messageType, strmessage);
                }
            }
        };
        ClientMessenger.prototype.sendMonitoringMessage = function (pluginID, message) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                    }
                }
            };
            xhr.open("POST", this._serverUrl + "api/push");
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            var data = JSON.stringify({ "_idsession": this._sessionId, "id": pluginID, "message": message });
            //xhr.setRequestHeader("Content-length", data.length.toString());
            xhr.send(data);
        };
        ClientMessenger.prototype.getMonitoringMessage = function (pluginID, onMonitoringMessage, from, to) {
            if (from === void 0) { from = "-20"; }
            if (to === void 0) { to = "-1"; }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (onMonitoringMessage)
                            onMonitoringMessage(JSON.parse(xhr.responseText));
                    }
                    else {
                        if (onMonitoringMessage)
                            onMonitoringMessage(null);
                    }
                }
                else {
                    if (onMonitoringMessage)
                        onMonitoringMessage(null);
                }
            };
            xhr.open("GET", this._serverUrl + "api/range/" + this._sessionId + "/" + pluginID + "/" + from + "/" + to);
            xhr.send();
        };
        return ClientMessenger;
    }());
    VORLON.ClientMessenger = ClientMessenger;
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var _Core = (function () {
        function _Core() {
            this._clientPlugins = new Array();
            this._dashboardPlugins = new Array();
            this._socketIOWaitCount = 0;
            this.debug = false;
            this._RetryTimeout = 1002;
            this._isHttpsEnabled = false;
        }
        Object.defineProperty(_Core.prototype, "Messenger", {
            get: function () {
                return VORLON.Core._messenger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "ClientPlugins", {
            get: function () {
                return VORLON.Core._clientPlugins;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "IsHttpsEnabled", {
            get: function () {
                return VORLON.Core._isHttpsEnabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "DashboardPlugins", {
            get: function () {
                return VORLON.Core._dashboardPlugins;
            },
            enumerable: true,
            configurable: true
        });
        _Core.prototype.RegisterClientPlugin = function (plugin) {
            VORLON.Core._clientPlugins.push(plugin);
        };
        _Core.prototype.RegisterDashboardPlugin = function (plugin) {
            VORLON.Core._dashboardPlugins.push(plugin);
        };
        _Core.prototype.StopListening = function () {
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
        };
        _Core.prototype.StartClientSide = function (serverUrl, sessionId, listenClientId) {
            var _this = this;
            if (serverUrl === void 0) { serverUrl = "'http://localhost:1337/'"; }
            if (sessionId === void 0) { sessionId = ""; }
            if (listenClientId === void 0) { listenClientId = ""; }
            VORLON.Core._side = VORLON.RuntimeSide.Client;
            VORLON.Core._sessionID = sessionId;
            VORLON.Core._listenClientId = listenClientId;
            if (serverUrl[serverUrl.length - 1] === '/') {
                serverUrl = serverUrl.slice(0, -1);
            }
            if (serverUrl.match("^https:\/\/")) {
                VORLON.Core._isHttpsEnabled = true;
            }
            // Checking socket.io
            if (VORLON.Tools.IsWindowAvailable && window.io === undefined) {
                if (this._socketIOWaitCount < 10) {
                    this._socketIOWaitCount++;
                    // Let's wait a bit just in case socket.io was loaded asynchronously
                    setTimeout(function () {
                        console.log("Vorlon.js: waiting for socket.io to load...");
                        VORLON.Core.StartClientSide(serverUrl, sessionId, listenClientId);
                    }, 1000);
                }
                else {
                    console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.");
                    VORLON.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.", 0);
                }
                return;
            }
            // Cookie
            var clientId;
            if (VORLON.Tools.IsWindowAvailable) {
                clientId = VORLON.Tools.ReadCookie("vorlonJS_clientId");
                if (!clientId) {
                    clientId = VORLON.Tools.CreateGUID();
                    VORLON.Tools.CreateCookie("vorlonJS_clientId", clientId, 1);
                }
            }
            else {
                clientId = VORLON.Tools.CreateGUID();
            }
            // Creating the messenger
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
            VORLON.Core._messenger = new VORLON.ClientMessenger(VORLON.Core._side, serverUrl, sessionId, clientId, listenClientId);
            // Connect messenger to dispatcher
            VORLON.Core.Messenger.onRealtimeMessageReceived = VORLON.Core._Dispatch;
            VORLON.Core.Messenger.onHeloReceived = VORLON.Core._OnIdentificationReceived;
            VORLON.Core.Messenger.onIdentifyReceived = VORLON.Core._OnIdentifyReceived;
            VORLON.Core.Messenger.onStopListenReceived = VORLON.Core._OnStopListenReceived;
            VORLON.Core.Messenger.onError = VORLON.Core._OnError;
            VORLON.Core.Messenger.onReload = VORLON.Core._OnReloadClient;
            this.sendHelo();
            // Launch plugins
            for (var index = 0; index < VORLON.Core._clientPlugins.length; index++) {
                var plugin = VORLON.Core._clientPlugins[index];
                plugin.startClientSide();
            }
            // Handle client disconnect
            if (VORLON.Tools.IsWindowAvailable) {
                window.addEventListener("beforeunload", function () {
                    VORLON.Core.Messenger.sendRealtimeMessage("", { socketid: VORLON.Core.Messenger.socketId }, VORLON.Core._side, "clientclosed");
                }, false);
            }
            else {
                process.stdin.resume(); //so the program will not close instantly
                var exitMessageWritten = false;
                function exitHandler(options, err) {
                    if (!exitMessageWritten) {
                        VORLON.Core.Messenger.sendRealtimeMessage("", { socketid: VORLON.Core.Messenger.socketId }, VORLON.Core._side, "clientclosed");
                        console.log('Disconnected from Vorlon.js instance');
                        exitMessageWritten = true;
                    }
                    process.exit(0);
                }
                //do something when app is closing
                process.on('exit', exitHandler.bind(null, { cleanup: true }));
                //catches ctrl+c event
                process.on('SIGINT', exitHandler.bind(null, { exit: true }));
                //catches uncaught exceptions
                process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
            }
            // Start global dirty check, at this point document is not ready,
            // little timeout to defer starting dirtycheck
            setTimeout(function () {
                _this.startClientDirtyCheck();
            }, 500);
        };
        _Core.prototype.sendHelo = function () {
            // Say 'helo'
            var heloMessage = {};
            if (VORLON.Tools.IsWindowAvailable) {
                heloMessage = {
                    ua: navigator.userAgent,
                    identity: sessionStorage["vorlonClientIdentity"] || localStorage["vorlonClientIdentity"]
                };
            }
            else {
                heloMessage = {
                    ua: "Node.js",
                    identity: "",
                    noWindow: true
                };
            }
            VORLON.Core.Messenger.sendRealtimeMessage("", heloMessage, VORLON.Core._side, "helo");
        };
        _Core.prototype.startClientDirtyCheck = function () {
            var _this = this;
            //sometimes refresh is called before document was loaded
            if (VORLON.Tools.IsWindowAvailable && !document.body) {
                setTimeout(function () {
                    _this.startClientDirtyCheck();
                }, 200);
                return;
            }
            var mutationObserver = VORLON.Tools.IsWindowAvailable && (window.MutationObserver || window.WebKitMutationObserver);
            if (mutationObserver) {
                if (!document.body.__vorlon)
                    document.body.__vorlon = {};
                var config = { attributes: true, childList: true, subtree: true, characterData: true };
                document.body.__vorlon._observerMutationObserver = new mutationObserver(function (mutations) {
                    var sended = false;
                    var cancelSend = false;
                    var sendComandId = [];
                    mutations.forEach(function (mutation) {
                        if (cancelSend) {
                            for (var i = 0; i < sendComandId.length; i++) {
                                clearTimeout(sendComandId[i]);
                            }
                            cancelSend = false;
                        }
                        if (mutation.target && mutation.target.__vorlon && mutation.target.__vorlon.ignore) {
                            cancelSend = true;
                            return;
                        }
                        if (mutation.previousSibling && mutation.previousSibling.__vorlon && mutation.previousSibling.__vorlon.ignore) {
                            cancelSend = true;
                            return;
                        }
                        if (mutation.target && !sended && mutation.target.__vorlon && mutation.target.parentNode && mutation.target.parentNode.__vorlon && mutation.target.parentNode.__vorlon.internalId) {
                            sendComandId.push(setTimeout(function () {
                                var internalId = null;
                                if (mutation && mutation.target && mutation.target.parentNode && mutation.target.parentNode.__vorlon && mutation.target.parentNode.__vorlon.internalId)
                                    internalId = mutation.target.parentNode.__vorlon.internalId;
                                VORLON.Core.Messenger.sendRealtimeMessage('ALL_PLUGINS', {
                                    type: 'contentchanged',
                                    internalId: internalId
                                }, VORLON.Core._side, 'message');
                            }, 300));
                        }
                        sended = true;
                    });
                });
                document.body.__vorlon._observerMutationObserver.observe(document.body, config);
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                console.log("dirty check using html string");
                var content;
                if (document.body)
                    content = document.body.innerHTML;
                setInterval(function () {
                    var html = document.body.innerHTML;
                    if (content != html) {
                        content = html;
                        VORLON.Core.Messenger.sendRealtimeMessage('ALL_PLUGINS', {
                            type: 'contentchanged'
                        }, VORLON.Core._side, 'message');
                    }
                }, 2000);
            }
        };
        _Core.prototype.StartDashboardSide = function (serverUrl, sessionId, listenClientId, divMapper) {
            if (serverUrl === void 0) { serverUrl = "'http://localhost:1337/'"; }
            if (sessionId === void 0) { sessionId = ""; }
            if (listenClientId === void 0) { listenClientId = ""; }
            if (divMapper === void 0) { divMapper = null; }
            VORLON.Core._side = VORLON.RuntimeSide.Dashboard;
            VORLON.Core._sessionID = sessionId;
            VORLON.Core._listenClientId = listenClientId;
            /* Notification elements */
            VORLON.Core._errorNotifier = document.createElement('x-notify');
            VORLON.Core._errorNotifier.setAttribute('type', 'error');
            VORLON.Core._errorNotifier.setAttribute('position', 'top');
            VORLON.Core._errorNotifier.setAttribute('duration', 5000);
            VORLON.Core._messageNotifier = document.createElement('x-notify');
            VORLON.Core._messageNotifier.setAttribute('position', 'top');
            VORLON.Core._messageNotifier.setAttribute('duration', 4000);
            document.body.appendChild(VORLON.Core._errorNotifier);
            document.body.appendChild(VORLON.Core._messageNotifier);
            // Checking socket.io
            if (VORLON.Tools.IsWindowAvailable && window.io === undefined) {
                if (this._socketIOWaitCount < 10) {
                    this._socketIOWaitCount++;
                    // Let's wait a bit just in case socket.io was loaded asynchronously
                    setTimeout(function () {
                        console.log("Vorlon.js: waiting for socket.io to load...");
                        VORLON.Core.StartDashboardSide(serverUrl, sessionId, listenClientId, divMapper);
                    }, 1000);
                }
                else {
                    console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.");
                    VORLON.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.", 0);
                }
                return;
            }
            // Cookie
            var clientId = VORLON.Tools.ReadCookie("vorlonJS_clientId");
            if (!clientId) {
                clientId = VORLON.Tools.CreateGUID();
                VORLON.Tools.CreateCookie("vorlonJS_clientId", clientId, 1);
            }
            // Creating the messenger
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
            VORLON.Core._messenger = new VORLON.ClientMessenger(VORLON.Core._side, serverUrl, sessionId, clientId, listenClientId);
            // Connect messenger to dispatcher
            VORLON.Core.Messenger.onRealtimeMessageReceived = VORLON.Core._Dispatch;
            VORLON.Core.Messenger.onHeloReceived = VORLON.Core._OnIdentificationReceived;
            VORLON.Core.Messenger.onIdentifyReceived = VORLON.Core._OnIdentifyReceived;
            VORLON.Core.Messenger.onStopListenReceived = VORLON.Core._OnStopListenReceived;
            VORLON.Core.Messenger.onError = VORLON.Core._OnError;
            // Say 'helo'
            var heloMessage = {
                ua: navigator.userAgent
            };
            VORLON.Core.Messenger.sendRealtimeMessage("", heloMessage, VORLON.Core._side, "helo");
            // Launch plugins
            for (var index = 0; index < VORLON.Core._dashboardPlugins.length; index++) {
                var plugin = VORLON.Core._dashboardPlugins[index];
                plugin.startDashboardSide(divMapper ? divMapper(plugin.getID()) : null);
            }
        };
        _Core.prototype.GetNumClientPluginsReady = function () {
            var ready = 0;
            VORLON.Core.ClientPlugins.forEach(function (plugin) {
                if (plugin.isReady()) {
                    ready++;
                }
            });
            return ready;
        };
        _Core.prototype.AllClientPluginsReady = function () {
            return VORLON.Core.ClientPlugins.length === VORLON.Core.GetNumClientPluginsReady();
        };
        _Core.prototype._OnStopListenReceived = function () {
            VORLON.Core._listenClientId = "";
        };
        _Core.prototype._OnIdentifyReceived = function (message) {
            //console.log('identify ' + message);
            if (VORLON.Core._side === VORLON.RuntimeSide.Dashboard) {
                VORLON.Core._messageNotifier.innerHTML = message;
                VORLON.Core._messageNotifier.show();
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                var div = document.createElement("div");
                div.className = "vorlonIdentifyNumber";
                div.style.position = "absolute";
                div.style.left = "0";
                div.style.top = "50%";
                div.style.marginTop = "-150px";
                div.style.width = "100%";
                div.style.height = "300px";
                div.style.fontFamily = "Arial";
                div.style.fontSize = "300px";
                div.style.textAlign = "center";
                div.style.color = "white";
                div.style.textShadow = "2px 2px 5px black";
                div.style.zIndex = "100";
                div.innerHTML = message;
                document.body.appendChild(div);
                setTimeout(function () {
                    document.body.removeChild(div);
                }, 4000);
            }
            else {
                console.log('Vorlon client n° ' + message);
            }
        };
        _Core.prototype.ShowError = function (message, timeout) {
            if (timeout === void 0) { timeout = 5000; }
            if (VORLON.Core._side === VORLON.RuntimeSide.Dashboard) {
                VORLON.Core._errorNotifier.innerHTML = message;
                VORLON.Core._errorNotifier.setAttribute('duration', timeout);
                VORLON.Core._errorNotifier.show();
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                var divError = document.createElement("div");
                divError.style.position = "absolute";
                divError.style.top = "0";
                divError.style.left = "0";
                divError.style.width = "100%";
                divError.style.height = "100px";
                divError.style.backgroundColor = "red";
                divError.style.textAlign = "center";
                divError.style.fontSize = "30px";
                divError.style.paddingTop = "20px";
                divError.style.color = "white";
                divError.style.fontFamily = "consolas";
                divError.style.zIndex = "1001";
                divError.innerHTML = message;
                document.body.appendChild(divError);
                if (timeout) {
                    setTimeout(function () {
                        document.body.removeChild(divError);
                    }, timeout);
                }
            }
        };
        _Core.prototype._OnError = function (err) {
            VORLON.Core.ShowError("Error while connecting to Vorlon server. Server may be offline.<BR>Error message: " + err.message);
        };
        _Core.prototype._OnIdentificationReceived = function (id) {
            VORLON.Core._listenClientId = id;
            if (VORLON.Core._side === VORLON.RuntimeSide.Client) {
                // Refresh plugins
                for (var index = 0; index < VORLON.Core._clientPlugins.length; index++) {
                    var plugin = VORLON.Core._clientPlugins[index];
                    plugin.refresh();
                }
            }
        };
        _Core.prototype._OnReloadClient = function (id) {
            if (VORLON.Tools.IsWindowAvailable) {
                document.location.reload();
            }
        };
        _Core.prototype._RetrySendingRealtimeMessage = function (plugin, message) {
            setTimeout(function () {
                if (plugin.isReady()) {
                    VORLON.Core._DispatchFromClientPluginMessage(plugin, message);
                    return;
                }
                VORLON.Core._RetrySendingRealtimeMessage(plugin, message);
            }, VORLON.Core._RetryTimeout);
        };
        _Core.prototype._Dispatch = function (message) {
            if (!message.metadata) {
                console.error('invalid message ' + JSON.stringify(message));
                return;
            }
            if (message.metadata.pluginID == 'ALL_PLUGINS') {
                VORLON.Core._clientPlugins.forEach(function (plugin) {
                    VORLON.Core._DispatchPluginMessage(plugin, message);
                });
                VORLON.Core._dashboardPlugins.forEach(function (plugin) {
                    VORLON.Core._DispatchPluginMessage(plugin, message);
                });
            }
            else {
                VORLON.Core._clientPlugins.forEach(function (plugin) {
                    if (plugin.getID() === message.metadata.pluginID) {
                        VORLON.Core._DispatchPluginMessage(plugin, message);
                        return;
                    }
                });
                VORLON.Core._dashboardPlugins.forEach(function (plugin) {
                    if (plugin.getID() === message.metadata.pluginID) {
                        VORLON.Core._DispatchPluginMessage(plugin, message);
                        return;
                    }
                });
            }
        };
        _Core.prototype._DispatchPluginMessage = function (plugin, message) {
            plugin.trace('received ' + JSON.stringify(message));
            if (message.metadata.side === VORLON.RuntimeSide.Client) {
                if (!plugin.isReady()) {
                    VORLON.Core._RetrySendingRealtimeMessage(plugin, message);
                }
                else {
                    VORLON.Core._DispatchFromClientPluginMessage(plugin, message);
                }
            }
            else {
                VORLON.Core._DispatchFromDashboardPluginMessage(plugin, message);
            }
        };
        _Core.prototype._DispatchFromClientPluginMessage = function (plugin, message) {
            if (message.command && plugin.DashboardCommands) {
                var command = plugin.DashboardCommands[message.command];
                if (command) {
                    command.call(plugin, message.data);
                    return;
                }
            }
            plugin.onRealtimeMessageReceivedFromClientSide(message.data);
        };
        _Core.prototype._DispatchFromDashboardPluginMessage = function (plugin, message) {
            if (message.command && plugin.ClientCommands) {
                var command = plugin.ClientCommands[message.command];
                if (command) {
                    command.call(plugin, message.data);
                    return;
                }
            }
            plugin.onRealtimeMessageReceivedFromDashboardSide(message.data);
        };
        return _Core;
    }());
    VORLON._Core = _Core;
    VORLON.Core = new _Core();
})(VORLON || (VORLON = {}));
