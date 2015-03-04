'use strict'

var React    = require('react')
var LoadMask = require('react-load-mask')

var Title = require('./Title')
var TitleFactory = React.createFactory(Title)

var Row = require('./Row')
var RowFactory = React.createFactory(Row)

var sorty     = require('sorty')
var assign    = require('object-assign')
var normalize = require('react-style-normalizer')

var getSelected = require('./getSelected')
var PropTypes   = React.PropTypes

var stringOrNumber = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
])

function emptyFn(){}

var scrollToRowIfNeeded = require('./scrollToRowIfNeeded')

var DISPLAY_NAME = 'ReactListView'

module.exports = React.createClass({

    displayName: DISPLAY_NAME,

    mixins: [
        require('./RowSelect'),
        require('./PrepareStyles')
    ],

    propTypes: {
        renderText: PropTypes.func,
        title     : stringOrNumber,
        rowHeight : stringOrNumber,
        rowStyle  : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.func
        ]),

        data       : PropTypes.array,
        loading    : PropTypes.bool,
        emptyText  : PropTypes.string,
        loadingText: PropTypes.string,

        idProperty     : PropTypes.string,
        displayProperty: PropTypes.string,
        selected       : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
            PropTypes.number
        ]),

        sortable     : PropTypes.bool,
        sortDirection: stringOrNumber,
        toggleSort   : PropTypes.func
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
        var item = this.data[index]

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
            'data-display-name': DISPLAY_NAME,

            rowBoundMethods: {
                onRowMouseDown : 'onMouseDown',
                onRowMouseUp   : 'onMouseUp',
                onRowClick     : 'onClick',
                onRowMouseEnter: 'onMouseEnter',
                onRowMouseLeave: 'onMouseLeave',
                onRowMouseOver : 'onMouseOver',
                onRowMouseOut  : 'onMouseOut'
            },

            emptyTextStyle: {
                fontStyle: 'italic'
            },

            sortable: true,

            selectRowOnClick: true,

            idProperty     : 'id',
            displayProperty: 'text',
            emptyText      : 'No records',
            loadingText    : '',

            rowHeight: null,

            defaultStyle: {
                display : 'flex',
                flexFlow: 'column',
                boxSizing: 'border-box',

                //theme props
                color: 'rgb(120, 120, 120)'
            },

            defaultTitleStyle: {
                userSelect: 'none',
                fontWeight: 'bold',
                padding: 5,
                background: 'linear-gradient(to bottom, #f7f7f7 0%,#efefef 13%,#e6e6e6 100%)',
                borderBottom: '1px solid #A8A8A8',
                flex: 'none',
                boxSizing: 'border-box',

                //ellipsis
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },

            defaultBodyStyle: {
                flex: '1 auto',
                position: 'relative',
                display: 'flex',
                alignItems: 'stretch',
                flexFlow: 'column',
                boxSizing: 'border-box'
            },

            defaultListStyle: {
                position: 'relative',
                width: '100%',
                overflow: 'auto',
                boxSizing: 'border-box'
            },

            defaultListTagStyle: {
                margin: 0,
                padding: 0,
                listStyleType: 'none',
                position: 'relative'
            },

            defaultEmptyListTagStyle: {

            },

            defaultEmptyListStyle: {
                flex: 1,
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexFlow: 'row'
            },

            defaultRowStyle: {
                boxSizing: 'border-box',
                listStyleType: 'none',
                cursor: 'default',

                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: 5
            },

            rowBorder: '1px dotted #A8A8A8',

            //row props
            defaultSelectedRowStyle: {
                background: 'rgb(103, 175, 233)', //primary color
                color: 'white'
            },

            defaultOverRowStyle: {
                background: 'rgb(118, 181, 231)',
                color: 'white'
            },

            defaultOverSelectedRowStyle: {
                color: 'white',
                background: 'rgb(90, 152, 202)' //pressed color
            },

            defaultSortArrowStyle: {
                color: 'rgb(103, 175, 233)', //primary color
                margin: 5
            },

            defaultLastRowStyle: {
                borderBottom: 0
            }
        }
    },

    componentWillReceiveProps: function(){
        this.checkData(this.props)
    },

    componentWillMount: function(){
        this.checkData(this.props)
    },

    componentDidMount: function() {
        if (this.props.scrollToIndex){
            setTimeout(function(){
                this.scrollToRowByIndex(this.props.scrollToIndex)
            }.bind(this), 0)
        }

        ;(this.props.onMount || emptyFn)(this)
    },

    checkData: function(props) {
        var data     = props.data
        var sortable = props.sortable && data && Array.isArray(data)

        if (sortable && this.state.defaultSortDirection != null){
            //if sorting should be done in state
            //then we have to do it here, to prevent sorting
            //on every state change

            this.setState({
                data: this.sort(data)
            })

        } else {
            this.setState({
                data: null
            })
        }
    },

    sort: function(data, sortDirection) {
        if (sortDirection === undefined){
            sortDirection = this.prepareSortDirection(this.props)
        }

        if (this.props.sortData){
            return this.props.sortData(data, sortDirection)
        }

        var sortInfo = {
            name: this.props.displayProperty,
            dir : sortDirection
        }

        if (this.props.sortType){
            sortInfo.type = this.props.sortType
        }

        if (this.props.sortFn){
            sortInfo.fn = props.sortFn
        }

        return sorty(sortInfo, [].concat(data))
    },

    getInitialState: function() {
        return {
            defaultSelected     : this.props.defaultSelected,
            defaultSortDirection: this.props.defaultSortDirection
        }
    },

    render: function() {

        var state = this.state
        var props = this.prepareProps(this.props)
        var title = this.renderTitle(props, state)
        var body  = this.renderBody(props, state)

        return (
            <div {...props} data={null}>
                {title}
                {body}
            </div>
        )
    },

    prepareProps: function(thisProps) {

        var props = assign({}, thisProps)

        props.sortDirection = this.prepareSortDirection(props)
        this.data = props.data = this.prepareData(props)

        props.count = this.data.length

        this.prepareStyles(props)

        props.className = this.prepareClassName(props)

        return props
    },

    prepareSortDirection: function(props) {
        var sortDirection = props.sortDirection

        if (sortDirection == null){
            sortDirection = this.state.defaultSortDirection
        }

        var dir = sortDirection === 'asc'?
                    1:
                    sortDirection === 'desc'?
                        -1:
                        sortDirection

        return dir
    },

    prepareData: function(props) {
        var data = this.state.data || props.data

        if (!data || !Array.isArray(data)){
            data = []
        }

        return data
    },

    prepareClassName: function(props) {
        var className = props.className || ''

        className += ' z-listview'

        if (!props.count){
            className += ' z-empty'
        }

        var sortableCls = props.sortable?
                            ' z-sortable':
                            ''
        if (props.sortable && props.sortDirection){
            sortableCls += props.sortDirection === 1?
                                ' z-asc':
                                props.sortDirection === -1?
                                    ' z-desc':
                                    ''
        }

        className += sortableCls

        return className
    },

    renderTitle: function(props) {
        if (props.title){

            var titleProps = {
                style        : props.titleStyle,
                sortDirection: props.sortDirection,
                className    : (props.titleClassName || '') + ' z-title',
                onClick      : this.handleTitleClick.bind(this, props),
                title        : props.title,
                children     : [
                    props.title,
                    this.renderTitleSort(props)
                ]
            }

            var defaultFactory = TitleFactory
            var factory        = props.titleFactory || defaultFactory

            var result = factory(titleProps)

            if (result === undefined){
                result = defaultFactory(titleProps)
            }

            return result
        }
    },

    renderTitleSort: function(props) {

        if (props.sortable !== false){
            var arrow = props.sortDirection == 1? '▲':
                            props.sortDirection == -1?
                                '▼':
                                null
            return <span style={props.sortArrowStyle} data-sort-dir={props.sortDirection}>
                {arrow}
            </span>
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
                <div data-display-name="scroller" style={{position: 'relative', width: '100%'}}>
                    {this.renderList(props, state)}
                </div>
            </div>
        )
    },

    renderList: function(props, state) {

        var className = 'z-list'
        var count = props.count
        var empty = false

        if (!count){
            empty = true
            className += ' z-empty'
        }

        var data     = props.data
        var selected = getSelected(props, state)
        return (
            <ul className={className} style={props.listTagStyle} >
                {empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state, selected))}
            </ul>
        )
    },

    renderEmpty: function(props) {
        return <li className="z-row-empty" style={props.emptyTextStyle}>{props.loading? props.loadingText: props.emptyText}</li>
    },

    renderRow: function(props, state, selected, item, index, arr) {
        var key  = item[props.idProperty]
        var text = item[props.displayProperty]

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

        var mouseOver = state.mouseOverKey === index
        if (mouseOver){
            rowClassName += ' z-over'
        }

        var rowStyle = props.rowStyle

        if (isSelected){
            rowStyle = assign({}, rowStyle, props.defaultSelectedRowStyle, props.selectedRowStyle)
        }

        if (mouseOver){
            rowStyle = assign({}, rowStyle, props.defaultOverRowStyle, props.overRowStyle)
        }

        if (isSelected && mouseOver){
            assign(rowStyle, props.defaultOverSelectedRowStyle, props.overSelectedRowStyle)
        }

        var isFirst = index === 0
        var isLast  = index === arr.length - 1

        if (isLast){
            rowStyle = assign({}, rowStyle, props.defaultLastRowStyle, props.lastRowStyle)
        }

        var rowProps = {
            key      : key,
            style    : rowStyle,
            'data-row-id': key,
            index    : index,
            first    : isFirst,
            last     : isLast,
            data     : item,
            className: rowClassName,
            mouseOver: mouseOver
        }

        if (typeof props.renderText == 'function'){
            text = props.renderText(text, item, index, rowProps, props)
        }

        rowProps.children = text

        rowProps.onClick = this.handleRowClick.bind(this, item, index, rowProps, props)

        if (typeof this.props.rowStyle == 'function'){
            rowProps.style = assign({}, rowProps.style, this.props.rowStyle(item, index, rowProps))
        }

        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

        rowProps.className = this.prepareRowClassName(rowProps, this.state)

        // if (props.rowFactory || props.renderText){
            rowProps.onMouseEnter = this.handleRowMouseOver.bind(this, item, index, props, key, rowProps, rowProps.onMouseOver)
            rowProps.onMouseLeave = this.handleRowMouseOut.bind(this, item, index, props, key, rowProps, rowProps.onMouseOut)
        // }

        var defaultFactory = RowFactory
        var factory = props.rowFactory || defaultFactory

        var result = factory(rowProps)

        if (result === undefined){
            result = defaultFactory(rowProps)
        }

        return result
    },

    handleRowMouseOver: function(item, index, props, key, rowProps, prevFn){

        this.setState({
            mouseOverKey: index
        })

        ;(prevFn || emptyFn)(item, index, rowProps)
    },

    handleRowMouseOut: function(item, index, props, key, rowProps, prevFn){
        this.setState({
            mouseOverKey: undefined
        })

        ;(prevFn || emptyFn)(item, index, rowProps)
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

    handleTitleClick: function(props, event){
        if (props.sortable){
            ;(props.toggleSort || this.toggleSort)(props)
        }
    },

    toggleSort: function(props){
        var dir = props.sortDirection
        var newDir = dir != 1 && dir != -1?
                        1:
                        dir === 1? -1: dir === -1?  0: 1

        var onSortChange = function(){
            ;(props.onSortChange || emptyFn)(newDir, props)
        }

        if (this.props.sortDirection == null){
            this.setState({
                defaultSortDirection: newDir,
                data: this.sort(props.data, newDir)
            }, onSortChange)
            //since the onSortChange specified by the user could do setState
            //and defaultSortDirection is set async on the state,
            //it may end up not set correctly, therefore we only
            //call the user defined function after state has been updated
        } else {
            onSortChange()
        }
    },

    handleRowClick: function(item, index, rowProps, props, event) {

        ;(props.onRowClick || emptyFn)(item, index, props, event)

        this.handleSelection(rowProps, event)
    }
})