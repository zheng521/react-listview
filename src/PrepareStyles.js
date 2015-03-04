'use strict';

var assign    = require('object-assign')
var normalize = require('react-style-normalizer')

module.exports = {

    prepareStyles: function(props) {
        props.style          = this.prepareStyle(props)
        props.titleStyle     = this.prepareTitleStyle(props)
        props.bodyStyle      = this.prepareBodyStyle(props)
        props.listWrapStyle  = this.prepareListWrapStyle(props)
        props.rowStyle       = this.prepareRowStyle(props)
        props.sortArrowStyle = this.prepareSortArrowStyle(props)
        props.listTagStyle   = this.prepareListTagStyle(props)
    },

    prepareTitleStyle: function(props) {

        var defaultTitleStyle = assign({}, props.defaultTitleStyle)

        if (props.sortable){
            defaultTitleStyle.cursor = 'pointer'
        }

        var titleStyle = assign({}, defaultTitleStyle, props.titleStyle)

        return normalize(titleStyle)
    },

    prepareBodyStyle: function(props) {

        var emptyBodyStyle
        var defaultEmptyBodyStyle

        if (!props.count){
            emptyBodyStyle        = props.emptyBodyStyle
            defaultEmptyBodyStyle = props.defaultEmptyBodyStyle
        }

        var bodyStyle = assign({},
                        props.defaultBodyStyle, defaultEmptyBodyStyle,
                        props.bodyStyle, props.emptyBodyStyle
                    )

        if (this.autoHeight){
            //we need this rule for IE, since when we configure the list with
            //height: 'auto' IE hits a bug and really needs this rule
            bodyStyle.flex = '1 0 auto'
        }

        return normalize(bodyStyle)
    },

    prepareStyle: function(props) {

        var style = {}
        var emptyStyle
        var defaultEmptyStyle

        if (!props.count){
            defaultEmptyStyle = props.defaultEmptyStyle
            emptyStyle = props.emptyStyle
        }

        assign(style, props.defaultStyle, defaultEmptyStyle, props.style, emptyStyle)

        if (style.height === 'auto'){
            this.autoHeight = true
        }

        return normalize(style)
    },

    prepareSortArrowStyle: function(props) {
        return assign({}, props.defaultSortArrowStyle, props.sortArrowStyle)
    },

    prepareRowStyle: function(props) {

        var rowStyle = props.rowStyle

        if (typeof rowStyle === 'function'){
            rowStyle = null
        }

        var rowBorderStyle

        if (props.rowBorder){
            rowBorderStyle = {
                borderBottom: props.rowBorder,
                borderRight : props.rowBorder
            }
        }

        var defaultRowStyle = props.defaultRowStyle

        if (props.rowHeight != null){
            defaultRowStyle = assign({}, defaultRowStyle, { height: props.rowHeight })
        }

        rowStyle = assign({}, defaultRowStyle, rowBorderStyle, rowStyle)

        return normalize(rowStyle)
    },

    prepareListWrapStyle: function(props) {
        var style = {}

        var defaultStyle = {
            border   : props.listBorder,
            width    : props.listWidth  || props.listSize,
            height   : props.listHeight || props.listSize,
            maxHeight: props.listMaxHeight,
            maxWidth : props.listMaxWidth
        }

        Object.keys(defaultStyle).forEach(function(key){
            if (defaultStyle[key] == null){
                delete defaultStyle[key]
            }
        })

        var defaultEmptyListStyle
        var emptyListStyle

        if (!props.count){
            defaultEmptyListStyle = props.defaultEmptyListStyle
            emptyListStyle = props.emptyListStyle
        }

        assign(style,
            props.defaultListStyle, defaultStyle, defaultEmptyListStyle,
            props.listStyle, emptyListStyle)

        return normalize(style)
    },

    prepareListTagStyle: function(props) {
        var defaultListTagStyle = props.defaultListTagStyle
        var emptyListTagStyle

        if (!props.count){
            defaultListTagStyle = assign({}, defaultListTagStyle, props.defaultEmptyListTagStyle)
            emptyListTagStyle = props.emptyListTagStyle
        }

        var style = assign({}, defaultListTagStyle, props.listTagStyle, emptyListTagStyle)

        return normalize(style)
    }
}