'use strict'

var React    = require('react')
var LoadMask = require('react-load-mask')
var Title = require('./Title')
var TitleFactory = React.createFactory(Title)
var Row = require('./Row')
var RowFactory = React.createFactory(Row)
var assign   = require('object-assign')

var getSelected   = require('./getSelected')

var stringOrNumber = React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
])

function emptyFn(){}

function scrollToRowIfNeeded(row, parentNode, scrollConfig){
    parentNode       = parentNode || row.parentNode
    var scrollTop    = parentNode.scrollTop
    var parentHeight = parentNode.offsetHeight
    var scrollBottom = scrollTop + parentHeight
    var rowTop       = row.offsetTop// + scrollTop
    var rowBottom    = rowTop + row.offsetHeight

    if (rowTop < scrollTop || rowBottom > scrollBottom){
        row.scrollIntoView(scrollConfig)

        return true
    }

    return false
}

module.exports = React.createClass({

    displayName: 'ReactListView',

    mixins: [
        require('./RowSelect')
    ],

    propTypes: {
        renderText: React.PropTypes.func,
        title     : stringOrNumber,
        rowHeight : stringOrNumber,
        rowStyle  : React.PropTypes.oneOf([
            React.PropTypes.object,
            React.PropTypes.func
        ]),

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

    scrollToRow: function(row) {
        if (row){
            return scrollToRowIfNeeded.call(this, row, this.refs.listWrap.getDOMNode())
        }
    },

    scrollToRowById: function(id) {
        this.scrollToRow(this.findRowById(id))
    },

    scrollToRowByIndex: function(index) {
        this.scrollToRow(this.findRowByIndex(index))

    },

    findRowByIndex: function(index) {
        var item = this.props.data[index]

        if (!item){
            return
        }

        var id = item[this.props.idProperty]

        return this.findRowById(id)
    },

    findRowById: function(id) {
        if (this.isMounted()){
            return this.getDOMNode().querySelector('[data-row-id="' + id + '"]')
        }
    },

    getDefaultProps: function() {
        return {
            rowBoundMethods: {
                onRowMouseDown: 'onMouseDown',
                onRowMouseUp  : 'onMouseUp',
                onRowClick    : 'onClick',
                onRowMouseOver: 'onMouseOver',
                onRowMouseOut : 'onMouseOut'
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
        return {
            defaultSelected: this.props.defaultSelected
        }
    },

    render: function() {

        var state = this.state
        var props = this.prepareProps(this.props)
        var title = this.renderTitle(props, state)
        var body  = this.renderBody(props, state)

        props.data = null

        if (props.scrollToIndex){
            setTimeout(function(){
                this.scrollToRow(props.scrollToIndex)
            }.bind(this), 0)
        }

        return (
            <div {...props}>
                {title}
                {body}
            </div>
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

        var rowStyle = props.rowStyle

        if (typeof rowStyle === 'function'){
            rowStyle = null
        }

        var rowStyle = assign({}, props.defaultRowStyle, rowStyle, {
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
            return <span className="z-icon-sort-info" />
        }
    },

    renderBody: function(props, state) {

        var bodyClassName = props.bodyClassName || ''

        bodyClassName += ' z-body'

        return (
            <div className={bodyClassName} style={props.bodyStyle}>
                {this.renderListWrap(props, state)}
                <LoadMask visible={props.loading} />
            </div>
        )
    },

    renderListWrap: function(props, state) {
        return (
            <div ref="listWrap" className="z-list-wrap" style={props.listWrapStyle}>
                <div className="z-scroller">
                    {this.renderList(props, state)}
                </div>
            </div>
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

    renderList: function(props, state) {

        var className = 'z-list'
        var count = this.getCount(props)
        var empty = false

        if (!count){
            empty = true
            className += ' z-empty'
        }

        var data = props.data || []

        var selected = getSelected(props, state)

        return (
            <ul className={className} style={props.listTagStyle} >
                {empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state, selected))}
            </ul>
        )
    },

    renderEmpty: function(props) {
        return <li className="z-row-empty">{props.loading? props.loadingText: props.emptyText}</li>
    },

    renderRow: function(props, state, selected, item, index, arr) {
        var key  = item[props.idProperty]
        var text = item[props.displayProperty]

        if (typeof props.renderText == 'function'){
            text = props.renderText(text, item, index, props)
        }

        var rowClassName = ''

        var isSelected = false

        if (typeof selected == 'object' && selected){
            isSelected = !!selected[key]
        } else if (selected != null){
            isSelected = key === selected
        }

        if (isSelected){
            this.selIndex = index
            rowClassName += ' z-selected'
        }

        if (state.mouseOverKey === key){
            rowClassName += ' z-over'
        }

        var rowStyle = props.rowStyle

        var rowProps = {
            key      : key,
            style    : rowStyle,
            'data-row-id': key,
            index    : index,
            first    : index === 0,
            last     : index === arr.length - 1,
            data     : item,
            className: rowClassName,
            children : text
        }

        rowProps.onClick = this.handleRowClick.bind(this, item, index, rowProps, props)


        if (typeof this.props.rowStyle == 'function'){
            rowProps.style = assign({}, rowProps.style, this.props.rowStyle(item, index, rowProps))
        }

        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

        rowProps.className = this.prepareRowClassName(rowProps, this.state)

        if (props.rowFactory){
            rowProps.onMouseOver = this.handleRowMouseOver.bind(this, item, index, props, key)
            rowProps.onMouseOut  = this.handleRowMouseOut.bind(this, item, index, props, key)
        }

        var defaultFactory = RowFactory
        var factory = props.rowFactory || defaultFactory

        var result = factory(rowProps)

        if (result === undefined){
            result = defaultFactory(rowProps)
        }

        return result
    },

    handleRowMouseOver: function(item, index, props, key){
        this.setState({
            mouseOverKey: key
        })
    },

    handleRowMouseOut: function(item, index, props, key){
        this.setState({
            mouseOverKey: undefined
        })
    },

    bindRowMethods: function(props, rowProps, bindMethods, item, index) {
        Object.keys(bindMethods).forEach(function(key){
            var eventName = bindMethods[key]

            if (props[key]){
                rowProps[eventName] = props[key].bind(null, item, index, props)
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

    handleRowClick: function(item, index, rowProps, props, event) {

        // if (props.selectRowOnClick){

        //     var key         = item[props.idProperty]
        //     var selected    = props.selected || {}
        //     var rowSelected = !!selected[key]

        //     var fn = rowSelected? 'onDeselect': 'onSelect'

        //     ;(props[fn] || emptyFn)(key, item, index, selected, props)
        //     ;(props.onSelectionChange || emptyFn)(key, item, index, selected, props)
        // }

        ;(props.onRowClick || emptyFn)(item, index, props, event)

        this.handleSelection(rowProps, event)
    }
})