/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rule_manager_1 = __webpack_require__(2);
var Item = /** @class */ (function () {
    function Item(el, options) {
        var _this = this;
        this.el = el;
        this.nativeValidatorOptions = {
            required: true,
            pattern: true,
            overflow: true,
            underflow: true,
            step: true,
            long: true,
            short: true,
            type: true,
        };
        this.dirty = false;
        this.rules = [];
        this.events = [];
        if (!options) {
            return;
        }
        if (typeof options.native === 'boolean') {
            Object.keys(this.nativeValidatorOptions).forEach(function (key) { return (_this.nativeValidatorOptions[key] = options.native); });
        }
        if (typeof options.native === 'object') {
            Object.assign(this.nativeValidatorOptions, options.native);
        }
        if (typeof options.rule !== 'undefined') {
            for (var key in options.rule) {
                if (options.rule.hasOwnProperty(key)) {
                    var ruleClass = rule_manager_1.RuleManager.get(key);
                    this.rules.push(new ruleClass(el, options.rule[key]));
                }
            }
        }
    }
    Item.getNode = function (exp) {
        if (typeof exp === 'string') {
            var nodes = Item.getNodes(exp);
            return nodes.length > 0 ? nodes[0] : null;
        }
        return exp;
    };
    Item.getNodes = function (exp) {
        if (typeof exp === 'string') {
            var nodes = document.querySelectorAll(exp);
            return Array.from(nodes);
        }
        return exp;
    };
    Item.getValue = function (control) {
        if (control instanceof HTMLSelectElement) {
            return control.options[control.selectedIndex].value;
        }
        if (control instanceof HTMLTextAreaElement) {
            return control.value;
        }
        if (control instanceof HTMLInputElement) {
            if (control.type === 'radio') {
                var selector = "input[type=\"radio\"][name=\"" + control.name + "\"]";
                var nodes = Array.from(document.querySelectorAll(selector));
                var found = nodes.find(function (el) { return el.checked; });
                return found ? found.value : null;
            }
            if (control.type === 'checkbox') {
                return control.checked ? control.value : null;
            }
            return control.value;
        }
        throw new Error();
    };
    Object.defineProperty(Item.prototype, "nativeValidity", {
        get: function () {
            var _a = this.el.validity, valueMissing = _a.valueMissing, patternMismatch = _a.patternMismatch, rangeOverflow = _a.rangeOverflow, rangeUnderflow = _a.rangeUnderflow, stepMismatch = _a.stepMismatch, tooLong = _a.tooLong, tooShort = _a.tooShort, typeMismatch = _a.typeMismatch;
            var _b = this.nativeValidatorOptions, required = _b.required, pattern = _b.pattern, overflow = _b.overflow, underflow = _b.underflow, step = _b.step, long = _b.long, short = _b.short, type = _b.type;
            return !((required && valueMissing) ||
                (pattern && patternMismatch) ||
                (overflow && rangeOverflow) ||
                (underflow && rangeUnderflow) ||
                (step && stepMismatch) ||
                (long && tooLong) ||
                (short && tooShort) ||
                (type && typeMismatch));
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.bind = function (events) {
        var _this = this;
        this.events = Array.from(events);
        this.events.forEach(function (ev) {
            _this.el.addEventListener(ev, _this.validate.bind(_this), false);
        });
    };
    Item.prototype.unbind = function () {
        var _this = this;
        this.events.forEach(function (ev) {
            _this.el.removeEventListener(ev, _this.validate.bind(_this), false);
        });
        this.events.length = 0;
    };
    Item.prototype.validate = function () {
        var info = {
            valid: false,
            native: this.el.validity,
            user: this.rules.map(function (rule) { return ({
                name: rule.name,
                valid: rule.validate(),
            }); }),
        };
        info.valid = this.nativeValidity && info.user.every(function (r) { return r.valid; });
        if (this.events.length > 0) {
            var event_1 = new CustomEvent('valli', {
                bubbles: true,
                cancelable: true,
                detail: { el: this.el, info: info },
            });
            this.el.dispatchEvent(event_1);
        }
        return info;
    };
    return Item;
}());
exports.Item = Item;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(0);
var Rule = /** @class */ (function () {
    function Rule(exp) {
        var node = item_1.Item.getNode(exp);
        if (node === null) {
            throw new Error('cannot find the element');
        }
        this.el = node;
    }
    Rule.prototype.validate = function () {
        return false;
    };
    return Rule;
}());
exports.Rule = Rule;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var equal_1 = __webpack_require__(5);
var different_1 = __webpack_require__(6);
var within_1 = __webpack_require__(7);
var RuleManager = /** @class */ (function () {
    function RuleManager() {
    }
    RuleManager.add = function (ruleClass) {
        var name = ruleClass.name.replace(/^./, function (s) { return s.toLowerCase(); });
        RuleManager.rule[name] = ruleClass;
    };
    RuleManager.get = function (name) {
        return RuleManager.rule[name];
    };
    RuleManager.rule = {
        equal: equal_1.Equal,
        different: different_1.Different,
        within: within_1.Within,
    };
    return RuleManager;
}());
exports.RuleManager = RuleManager;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = __webpack_require__(4);
var valli = new main_1.Valli('form', 'input');
var btn = document.querySelector('button[type="submit"]');
document.querySelector('form').addEventListener('valli', function (e) {
    btn.style.borderColor = e.detail.info.valid ? 'black' : 'red';
}, false);
document.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('valli', function (e) {
        e.detail.el.style.borderColor = e.detail.info.valid ? 'black' : 'red';
    }, false);
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rule_manager_1 = __webpack_require__(2);
var item_1 = __webpack_require__(0);
var Valli = /** @class */ (function () {
    function Valli(expForm, expControls) {
        var _this = this;
        this.events = ['input'];
        this.items = [];
        var nodes = item_1.Item.getNodes(expControls);
        if (nodes.length === 0) {
            return;
        }
        Array.from(nodes).forEach(function (node) {
            var el = node;
            var data = el.getAttribute('data-valli');
            var options = data ? eval("(" + data + ")") : null;
            var item = new item_1.Item(el, options);
            _this.items.push(item);
            item.bind(_this.events);
        });
        if (typeof expForm === 'string') {
            var el = document.querySelector(expForm);
            if (el === null) {
                throw new Error('cannot find the element');
            }
            this.form = el;
        }
        else {
            this.form = expForm;
        }
        this.form.noValidate = true;
        this.validate();
    }
    Valli.addRule = function (ruleClass) {
        rule_manager_1.RuleManager.add(ruleClass);
    };
    Valli.prototype.validate = function () {
        this.items.forEach(function (item) { return item.validate(); });
    };
    return Valli;
}());
exports.Valli = Valli;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = __webpack_require__(1);
var item_1 = __webpack_require__(0);
var Equal = /** @class */ (function (_super) {
    __extends(Equal, _super);
    function Equal(exp, options) {
        var _this = _super.call(this, exp) || this;
        _this.name = 'equal';
        var node = item_1.Item.getNode(options.partner);
        if (node === null) {
            throw new Error('cannot find the element');
        }
        _this.partner = node;
        return _this;
    }
    Equal.prototype.validate = function () {
        return item_1.Item.getValue(this.el) === item_1.Item.getValue(this.partner);
    };
    return Equal;
}(rule_1.Rule));
exports.Equal = Equal;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = __webpack_require__(1);
var item_1 = __webpack_require__(0);
var Different = /** @class */ (function (_super) {
    __extends(Different, _super);
    function Different(exp, options) {
        var _this = _super.call(this, exp) || this;
        _this.name = 'different';
        var node = item_1.Item.getNode(options.partner);
        if (node === null) {
            throw new Error('cannot find the element');
        }
        _this.partner = node;
        return _this;
    }
    Different.prototype.validate = function () {
        return item_1.Item.getValue(this.el) !== item_1.Item.getValue(this.partner);
    };
    return Different;
}(rule_1.Rule));
exports.Different = Different;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = __webpack_require__(1);
var item_1 = __webpack_require__(0);
var Within = /** @class */ (function (_super) {
    __extends(Within, _super);
    function Within(exp, options) {
        var _this = _super.call(this, exp) || this;
        _this.name = 'within';
        var node = item_1.Item.getNode(options.partner);
        if (node === null) {
            throw new Error('cannot find the element');
        }
        _this.partner = node;
        _this.begin = options.begin ? _this.el : _this.partner;
        _this.end = options.begin ? _this.partner : _this.el;
        _this.equal = !!options.equal;
        return _this;
    }
    Within.prototype.mismatch = function (control) {
        if (control instanceof HTMLInputElement) {
            var value = item_1.Item.getValue(control);
            if (value === null || control.pattern === '') {
                return false;
            }
            return new RegExp(control.pattern).test(value) !== true;
        }
        return false;
    };
    Within.prototype.validate = function () {
        var begin = item_1.Item.getValue(this.begin);
        var end = item_1.Item.getValue(this.end);
        if (!begin ||
            !end ||
            this.mismatch(this.begin) ||
            this.mismatch(this.end)) {
            return false;
        }
        var b = new Date(begin);
        var e = new Date(end);
        return this.equal ? e >= b : e > b;
    };
    return Within;
}(rule_1.Rule));
exports.Within = Within;


/***/ })
/******/ ]);
//# sourceMappingURL=test.spec.bundle.js.map