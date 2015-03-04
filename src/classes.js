'use strict';

function notEmpty(x){
    return !!x
}

module.exports = function(){
    return Array.prototype.filter.call(arguments, notEmpty).join(' ')
}