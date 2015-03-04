'use strict';

var assign    = require('object-assign')
var normalize = require('react-style-normalizer')

function notEmpty(x){
    return !!x
}

module.exports = {

    prepareClasses: function(props) {
        props.className = this.prepareClassName(props)
    },

    prepareClassName: function(props) {
        var result = [props.defaultClassName, props.className]

        if (props.empty){
            result.push(props.defaultEmptyClassName, props.emptyClassName)
        }

        if (props.sortable){
            result.push(props.defaultSortableClassName, props.sortableClassName)

            if (props.sortDirection == 1){
                result.push(props.defaultSortAscClassName, props.sortAscClassName)
            } else if (props.sortDirection == -1){
                result.push(props.defaultSortDescClassName, props.sortDescClassName)
            }
        }

        return result.filter(notEmpty).join(' ')
    },

    prepareRowClassName: function(props, rowProps) {

        var result = [
            props.defaultRowClassName,
            props.rowClassName,
            rowProps.className
        ]

        var index = rowProps.index

        if (rowProps.odd){
            result.push(
                props.defaultOddRowClassName,
                props.oddRowClassName
            )
        } else {
            result.push(
                props.defaultEvenRowClassName,
                props.evenRowClassName
            )
        }

        if (rowProps.first){
            result.push(
                props.defaultFirstRowClassName,
                props.firstRowClassName
            )
        }

        if (rowProps.last){
            result.push(
                props.defaultLastRowClassName,
                props.lastRowClassName
            )
        }

        return result.filter(notEmpty).join(' ')
    }
}