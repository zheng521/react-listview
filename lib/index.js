'use strict'

var React    = require('react')
var LoadMask = require('react-load-mask')
var Title = require('./Title')
var TitleFactory = React.createFactory(Title)
var Row = require('./Row')
var RowFactory = React.createFactory(Row)
var assign   = require('object-assign')

var stringOrNumber = React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
])

function emptyFn(){}

module.exports = React.createClass({

    displayName: 'ReactListView',

    propTypes: {
        renderText: React.PropTypes.func,
        title     : stringOrNumber,
        rowHeight : stringOrNumber,

        data       : React.PropTypes.array,
        loading    : React.PropTypes.bool,
        emptyText  : React.PropTypes.string,
        loadingText: React.PropTypes.string,

        idProperty     : React.PropTypes.string,
        displayProperty: React.PropTypes.string,
        selected       : React.PropTypes.object,

        sortable     : React.PropTypes.bool,
        sortDirection: stringOrNumber,
        toggleSort   : React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            rowBoundMethods: {
                onRowMouseDown: 'onMouseDown',
                onRowMouseUp  : 'onMouseup'
            },

            sortable: true,

            selectRowOnClick: true,
            idProperty: 'id',
            displayProperty: 'text',
            emptyText: 'No records',
            loadingText: '',

            rowHeight: null,

            defaultStyle: {},
            defaultListStyle: {}
        }
    },

    getInitialState: function() {
        return {}
    },

    render: function() {

        var props = this.prepareProps(this.props)
        var title = this.renderTitle(props)
        var body  = this.renderBody(props)

        props.data = null

        return (
            React.createElement("div", React.__spread({},  props), 
                title, 
                body
            )
        )
    },

    prepareProps: function(thisProps) {

        var props = assign({}, thisProps)

        props.style         = this.prepareStyle(props)
        props.titleStyle    = this.prepareTitleStyle(props)
        props.bodyStyle     = this.prepareBodyStyle(props)
        props.listWrapStyle = this.prepareListWrapStyle(props)
        props.rowStyle      = this.prepareRowStyle(props)

        props.className = this.prepareClassName(props)

        return props
    },

    prepareStyle: function(props) {

        var style = {}

        assign(style, props.defaultStyle, props.style)

        return style
    },

    prepareClassName: function(props) {
        var className = props.className || ''

        className += ' z-listview'

        if (!this.getCount(props)){
            className += ' z-empty'
        }

        var sortableCls = props.sortable?
                            ' z-sortable':
                            ''
        if (props.sortable && props.sortDirection){
            sortableCls += props.sortDirection === 'asc' || props.sortDirection === 1?
                                ' z-asc':
                                props.sortDirection === 'desc' || props.sortDirection === -1?
                                    ' z-desc':
                                    ''
        }

        className += sortableCls

        return className
    },

    prepareBodyStyle: function(props) {
        var bodyStyle = assign({}, props.defaultBodyStyle, props.bodyStyle)

        return bodyStyle
    },

    prepareTitleStyle: function(props) {
        var titleStyle = assign({}, props.defaultTitleStyle, props.titleStyle)

        return titleStyle
    },

    prepareRowStyle: function(props) {

        var rowStyle = assign({}, props.defaultRowStyle, props.rowStyle, {
            height: props.rowHeight
        })

        return rowStyle
    },

    prepareListWrapStyle: function(props) {
        var style = {}

        assign(style, props.defaultListStyle, {
            border   : props.listBorder,
            width    : props.listWidth  || props.listSize,
            height   : props.listHeight || props.listSize,
            maxHeight: props.listMaxHeight,
            maxWidth : props.listMaxWidth
        }, props.listStyle)

        return style
    },

    renderTitle: function(props) {
        if (props.title){
            return (props.titleFactory || TitleFactory)({
                style    : props.titleStyle,
                className: (props.titleClassName || '') + ' z-title',
                onClick: this.handleTitleClick.bind(this, props)
            }, props.title, this.renderTitleSort(props))
        }
    },

    renderTitleSort: function(props) {
        if (props.sortable !== false){
            return React.createElement("span", {className: "z-icon-sort-info"})
        }
    },

    renderBody: function(props) {

        var bodyClassName = props.bodyClassName || ''

        bodyClassName += ' z-body'

        return (
            React.createElement("div", {className: bodyClassName, style: props.bodyStyle}, 
                this.renderListWrap(props), 
                React.createElement(LoadMask, {visible: props.loading})
            )
        )
    },

    renderListWrap: function(props) {
        return (
            React.createElement("div", {className: "z-list-wrap", style: props.listWrapStyle}, 
                React.createElement("div", {className: "z-scroller"}, 
                    this.renderList(props)
                )
            )
        )
    },

    getCount: function(props) {
        return props.data?
                    props.data.length:
                    0
    },

    handleTitleClick: function(props, event){
        if (props.sortable){
            ;(props.toggleSort || this.toggleSort)(props)
        }
    },

    toggleSort: function(props){
        var dir = props.sortDirection === 'asc'?
                    1:
                    props.sortDirection === 'desc'?
                        -1:
                        props.sortDirection

        var newDir
        if (dir != 1 && dir != -1){
            newDir = 1
        } else {
            newDir = dir === 1? -1: dir === -1?  0: 1
        }

        ;(props.onSortChange || emptyFn)(newDir, props)
    },

    renderList: function(props) {

        var className = 'z-list'
        var count = this.getCount(props)
        var empty = false

        if (!count){
            empty = true
            className += ' z-empty'
        }

        var data = props.data || []

        return (
            React.createElement("ul", {className: className, style: props.listTagStyle}, 
                empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props))
            )
        )
    },

    renderEmpty: function(props) {
        return React.createElement("li", {className: "z-row-empty"}, props.loading? props.loadingText: props.emptyText)
    },

    renderRow: function(props, item, index, arr) {
        var key = item[props.idProperty]
        var text = item[props.displayProperty]

        if (typeof props.renderText == 'function'){
            text = props.renderText(text, item, index, props)
        }

        var rowClassName = ''

        if (props.selected && props.selected[key]){
            rowClassName += ' z-selected'
        }

        var rowProps = {
            key     : key,
            style   : props.rowStyle,
            index   : index,
            first   : index === 0,
            last    : index === arr.length - 1,
            item    : item,
            className: rowClassName,
            onClick : this.handleRowClick.bind(this, item, index, props),
            children: text
        }

        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

        rowProps.className = this.prepareRowClassName(rowProps, this.state)

        return (props.rowFactory || RowFactory)(rowProps)
    },

    bindRowMethods: function(props, rowProps, bindMethods, item, index) {
        Object.keys(bindMethods).forEach(function(key){
            var eventName = bindMethods[key]

            if (props[key]){
                rowProps[eventName] = props[key].bind(this, item, index, props)
            }
        }, this)
    },

    prepareRowClassName: function(rowProps, state) {
        var index = rowProps.index

        var className = (rowProps.className || '') + ' z-row'

        if (index % 2){
            className += ' z-odd'
        } else {
            className += ' z-even'
        }

        if (rowProps.first){
            className += ' z-first'
        }

        if (rowProps.last){
            className += ' z-last'
        }

        return className
    },

    handleRowClick: function(item, index, props, event) {

        if (props.selectRowOnClick){
            var key         = item[props.idProperty]
            var selected    = props.selected || {}
            var rowSelected = !!selected[key]

            var fn = rowSelected? 'onDeselect': 'onSelect'

            ;(props[fn] || emptyFn)(key, item, index, selected, props)
            ;(props.onSelectionChange || emptyFn)(key, item, index, selected, props)
        }

        ;(props.onRowClick || emptyFn)(item, index, props, event)
    }
})