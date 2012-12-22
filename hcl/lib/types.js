// TODO: simplify and add new tests

// TODO: TESTS!!

// TODO: make an anti_eval method for all of the types that returns a string
// that will generate them

exports.number = function(number) {
    return {
        value: number,
        type: 'number',
        json: function() {
            return this.value.toString();
        }
    };
};

exports.string = function(string) {
    return {
        value: string,
        type: 'string',
        json: function() {
            return this.value;
        }
    };
};

exports.word = function(word) {
    return {
        value: word,
        type: 'word',
        json: function() {
            return (['js', 'macro-exists'].indexOf(this.value) !== -1) ?
                'types.word("' + this.value + '")' :
                this.value;
        }
    };
};

exports.boolean = function(boolean) {
    return {
        value: boolean,
        type: 'boolean',
        json: function() {
            return this.value + '';
        }
    };
};

exports.list = function(list) {
    for (var i = 0; i < list.length; i++) {
        list[i] = wrap(list[i]);
    }
    list.type = 'list';
    list.map = function(func) {
        var result = [];
        //console.log(this);
        for (var i = 0; i < this.length; i++) {
            result.push(func(this[i]));
        }
        //console.log(result);
        result.type = list;
        result.map = this.map;
        result.json = this.json;
        result.slice = this.slice;
        return result;
    };
    list.json = function() {
        return '[' + this.map(function(x) {
            //console.log(typeof(x.json) === 'function');
            return (typeof(x.json) === 'function') ? x.json() : x;
        }).join(', ') + ']';
    };
    list.slice = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
        return wrap([].slice.apply(this, args));
    };
    return list;
};

var wrap = function(value) {
    
    if (['string', 'word',
         'boolean', 'number'].indexOf(value.type) !== -1) {
        return value;
    }
    
    if (Object.prototype.toString.call(value) === '[object Array]') {
        return exports.list(value);
    }
    
    if (typeof(exports[typeof(value)]) === 'function') {
        return exports[typeof(value)](value);
    }
    
    console.log(value);
    throw new Error('Poorly formed ast..');
};