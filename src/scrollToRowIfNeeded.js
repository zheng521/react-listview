'use strict';

module.exports = function scrollToRowIfNeeded(row, parentNode, scrollConfig){
    parentNode       = parentNode || row.parentNode

    var scrollTop    = parentNode.scrollTop
    var parentHeight = parentNode.offsetHeight
    var scrollBottom = scrollTop + parentHeight
    var rowTop       = row.offsetTop
    var rowBottom    = rowTop + row.offsetHeight

    if (rowTop < scrollTop || rowBottom > scrollBottom){
        row.scrollIntoView(scrollConfig)

        return true
    }

    return false
}