'use strict'

var findIndexBy = require('./findIndexBy')

function findIndexByProperty(arr, name, value){
    return findIndexBy(arr, function(info){
        return info[name] === value
    })
}

module.exports = findIndexByProperty