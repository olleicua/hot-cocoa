// TODO: simplify and add new tests

exports.number = function(number) {
    return {
        value: number,
        type: 'number',
        json: function() {
            return this.value;
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
            return this.value;
        }
    };
};

exports.boolean = function(boolean) {
    return {
        value: boolean,
        type: 'boolean',
        json: function() {
            return this.value;
        }
    };
};

exports.list = function(list) {
    list.type = 'list';
    list.map = function(func) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result.push(func(this[i]));
        }
        return result;
    };
    list.json = function() {
        return '[' + this.map(function(x) {
            return x.json();
        }).join(', ') + ']';
    };
    return list;
};