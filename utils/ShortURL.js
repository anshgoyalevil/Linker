//ShortURL Logic
var ShortURL = new function () {

    var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
        _base = _alphabet.length;

    this.encode = function (num) {
        var str = '';
        while (num > 0) {
            str = _alphabet.charAt(num % _base) + str;
            num = Math.floor(num / _base);
        }
        return str;
    };

    this.decode = function (str) {
        var num = 0;
        for (var i = 0; i < str.length; i++) {
            num = num * _base + _alphabet.indexOf(str.charAt(i));
        }
        return num;
    };

};

module.exports = ShortURL;