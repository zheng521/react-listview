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

var classes             = require('./classes')
var findIndexByProperty = require('./findIndexByProperty')
var getSelected         = require('./getSelected')
var PropTypes   = React.PropTypes

var stringOrNumber = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
])

function emptyFn(){}

var scrollToRowIfNeeded = require('./scrollToRowIfNeeded')

var DISPLAY_NAME = 'ReactListView'
var MAX_SCREEN_SIZE
var BUFFER_ROW_COUNT

var SIZING_ID = '___SIZING___'

module.exports = React.createClass({

    displayName: DISPLAY_NAME,

    mixins: [
        require('./RowSelect'),
        require('./PrepareStyles'),
        require('./PrepareClasses')
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

    xshouldComponentUpdate: function() {
        return false
    },

    scrollToRow: function(row) {
        if (row){
            return scrollToRowIfNeeded.call(this, row, this.refs.scrollTarget.getDOMNode())
        }
    },

    scrollToRowById: function(id) {
        var row = this.findRowById(id)
        var index

        if (row){
            index = row.getAttribute('data-index') * 1
        } else {
            index = findIndexByProperty(this.data, this.props.idProperty, id)
        }

        this.scrollToRowByIndex(index)
    },

    scrollToRowByIndex: function(index) {
        var row

        if (index < 0 || index >= this.data.length){
            return
        }

        if (this.isVirtualRendering()){
            var indexes    = this.getRenderIndexes()
            var startIndex = indexes.start
            var endIndex   = indexes.end

            if (index < startIndex || index >= endIndex){
                this.setState({
                    renderStartIndex: index
                }, function(){
                    this.scrollToRowByIndex(index)
                })

                return
            }
        }

        row = this.findRowByIndex(index)

        this.scrollToRow(row)
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

            virtualRendering: true,
            rowHeight: null,
            bufferRowCount: null,
            rowsOutsideView: 5,

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
                boxSizing: 'border-box',

                overflow: 'hidden' //check why does firefox need this
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
                userSelect: 'none',

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
                margin: 5,
                fontSize: '0.85em'
            },

            defaultLastRowStyle: {
                borderBottom: 0
            },

            defaultClassName: 'z-listview',
            defaultEmptyClassName: 'z-empty',
            defaultSortableClassName: 'z-sortable',
            defaultSortAscClassName: 'z-asc',
            defaultSortDescClassName: 'z-dec',

            defaultTitleClassName: 'z-title',
            defaultRowClassName: 'z-row',

            defaultFirstRowClassName: 'z-first',
            defaultLastRowClassName: 'z-last',

            defaultEvenRowClassName: 'z-even',
            defaultOddRowClassName: 'z-odd',

            startIndex: 0
        }
    },

    componentWillReceiveProps: function(){
        this.checkData(this.props)

        setTimeout(function(){
            this.checkRowHeight(this.props)
            this.updateStartIndex
        }.bind(this), 10)
    },

    componentWillMount: function(){

        this.checkData(this.props)
    },

    componentDidMount: function() {
        this.checkRowHeight(this.props)

        if (this.props.scrollToIndex){
            setTimeout(function(){
                this.scrollToRowByIndex(this.props.scrollToIndex)
            }.bind(this), 0)
        }

        ;(this.props.onMount || emptyFn)(this)
    },

    checkRowHeight: function(props) {
        if (this.isVirtualRendering()){

            //if virtual rendering and no rowHeight specifed, we use
            var row = this.findRowById(SIZING_ID)
            var config = {}

            if (row){
                this.setState({
                    rowHeight: config.rowHeight = row.offsetHeight
                })
            }

            //this ensures rows are kept in view
            this.updateStartIndex(props, undefined, config)
        }
    },

    checkData: function(props) {
        var data     = props.data
        var sortable = props.sortable && data && Array.isArray(data)
        var newState = {}

        if (sortable && this.state.defaultSortDirection != null){
            //if sorting should be done in state
            //then we have to do it here, to prevent sorting
            //on every state change

            newState.data = this.sort(data)
        } else {
            newState.data = null
        }

        this.setState(newState)
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
            renderStartIndex    : 0,
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

        props.rowHeight = this.prepareRowHeight(props)
        this.data = props.data = this.prepareData(props)

        //make sure data is ready when preparing virtual rendering
        this.prepareVirtualRendering(props, this.state)

        props.sortDirection = this.prepareSortDirection(props)

        props.count = this.data.length
        props.empty = !props.count

        this.prepareStyles(props)

        this.prepareClasses(props)

        return props
    },

    prepareRowHeight: function(){
        return this.props.rowHeight == null? this.state.rowHeight: this.props.rowHeight
    },

    prepareBufferRowCount: function(props){

        if (props.bufferRowCount != null){
            return props.bufferRowCount
        }


        var win = global.window? global.window: {screen: { width: 5000, height: 5000}}

        MAX_SCREEN_SIZE  = MAX_SCREEN_SIZE  || Math.max(win.screen.height, win.screen.width)
        BUFFER_ROW_COUNT = BUFFER_ROW_COUNT || Math.ceil(MAX_SCREEN_SIZE / 12)

        var rowHeight = this.prepareRowHeight(props)

        if (props.style && props.style.height){
            var listHeight = props.style.height

            if (listHeight * 1 === listHeight){
                MAX_SCREEN_SIZE = listHeight
                debugger
            }
        }

        return props.bufferRowCount == null && rowHeight != null?
                        Math.ceil(MAX_SCREEN_SIZE/rowHeight) + props.rowsOutsideView:
                        BUFFER_ROW_COUNT
    },

    isVirtualRendering: function(){
        return this.props.virtualRendering || (this.props.rowHeight != null)
    },

    getRenderIndexes: function(){
        var bufferRowCount = this.prepareBufferRowCount(this.props)
        var startIndex     = this.state.renderStartIndex
        var endIndex       = Math.min(this.data.length, startIndex + bufferRowCount)

        return {
            start: startIndex,
            end  : endIndex
        }
    },

    prepareVirtualRendering: function(props, state) {
        var rowHeight = props.rowHeight

        props.virtualRendering = this.isVirtualRendering()

        if (props.virtualRendering && !props.empty){
            var data    = this.data
            var indexes = this.getRenderIndexes()

            var startIndex  = indexes.start
            var endIndex    = indexes.end

            props.startIndex = startIndex
            props.endIndex = endIndex

            props.beforeHeight = startIndex * rowHeight
            props.afterHeight  = (data.length - endIndex) * rowHeight
        }
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

    renderTitle: function(props) {
        if (props.title){

            var titleProps = {
                style        : props.titleStyle,
                sortDirection: props.sortDirection,
                className    : classes(props.defaultTitleClassName, props.titleClassName),
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
            <div className="z-list-wrap" style={props.listWrapStyle} ref="scrollTarget" onScroll={this.handleScroll.bind(this, props)}>
                <div data-display-name="scroller" style={{position: 'relative', width: '100%'}}>
                    {this.renderList(props, state)}
                </div>
            </div>
        )
    },

    handleScroll: function(props, event) {
        var scrollTop = event.target.scrollTop

        this.updateStartIndex(props, scrollTop)
    },

    updateStartIndex: function(props, scrollTop, config){

        if (scrollTop == null){
            scrollTop = this.refs.scrollTarget.getDOMNode().scrollTop
        }

        var state = {
            menuColumn: null
        }

        config = config || {}

        var rowHeight = config.rowHeight || this.prepareRowHeight()
        var virtualRendering = this.props.virtualRendering || rowHeight != null

        if (virtualRendering){
            var index = Math.floor(scrollTop / rowHeight) - Math.floor(this.props.rowsOutsideView / 2)

            this.setState({
                renderStartIndex: index <= 0? 0: index
            })
        }
    },

    renderList: function(props, state) {

        var className = 'z-list'
        var count     = props.count
        var empty     = false

        if (!count){
            empty = true
            className += ' z-empty'
        }

        var data     = props.data
        var selected = getSelected(props, state)
        var before
        var after

        var sizingRow

        if (props.virtualRendering && !empty){

            before = <div style={{height: props.beforeHeight, width: 1}}></div>
            after  = <div style={{height: props.afterHeight, width: 1}}></div>

            data = data.slice(props.startIndex, props.endIndex)

            if (!this.props.rowHeight){
                var sizingItem = {}
                sizingItem[props.displayProperty] = 'Sizing'
                sizingItem[props.idProperty]      = SIZING_ID
                sizingRow = this.renderRow(props, state, selected, sizingItem, -1, [], {visibility: 'hidden', position: 'absolute', height: null})
            }
        }

        this.renderData = data

        return (
            <ul className={className} style={props.listTagStyle}>
                {before}
                {sizingRow}
                {empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state, selected))}
                {after}
            </ul>
        )
    },

    renderEmpty: function(props) {
        return <li className="z-row-empty" style={props.emptyTextStyle}>{props.loading? props.loadingText: props.emptyText}</li>
    },

    renderRow: function(props, state, selected, item, index, arr, extraStyle) {

        var renderIndex = index

        if (props.virtualRendering){
            index += props.startIndex
        }

        var key    = renderIndex
        var itemId = item[props.idProperty]
        var text   = item[props.displayProperty]

        var rowClassName = ''

        var isSelected = false

        if (typeof selected == 'object' && selected){
            isSelected = !!selected[itemId]
        } else if (selected != null){
            isSelected = itemId === selected
        }

        if (isSelected){
            this.selIndex = index
            rowClassName += ' z-selected'
        }

        var mouseOver = state.mouseOverKey === index

        if (mouseOver){
            rowClassName += ' z-over'
        }

        var rowStyle = assign({}, props.rowStyle, extraStyle)

        var selectedStyle = props.selectedRowStyle
        if (isSelected){
            assign(rowStyle, selectedStyle)
        }

        var mouseOverStyle = props.overRowStyle
        if (mouseOver){
            assign(rowStyle, mouseOverStyle)
        }

        var overSelectedStyle = props.overSelectedRowStyle

        if (isSelected && mouseOver){
            assign(rowStyle, overSelectedStyle)
        }

        var isFirst = index === 0
        var isLast  = index === this.data.length - 1
        var isOdd   = index % 2
        var isEven  = !isOdd

        if (isLast){
            assign(rowStyle, props.lastRowStyle)
        }

        if (isOdd){
            props.oddRowStyle && assign(rowStyle, props.oddRowStyle)
        } else {
            props.evenRowStyle && assign(rowStyle, props.evenRowStyle)
        }

        var forceUpdate

        var rowProps = {
            key      : key,

            'data-row-id': itemId,
            'data-index': index,

            index    : index,
            first    : isFirst,
            last     : isLast,
            odd      : isOdd,
            even     : isEven,
            data     : item,
            selected : isSelected,

            className: rowClassName,
            style    : rowStyle,

            overStyle: mouseOverStyle,
            selectedStyle: selectedStyle,
            overSelectedStyle: overSelectedStyle,

            mouseOver: mouseOver,
            mouseOverChange: this.mouseOverChange,
            selectedChange : this.selectedChange
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

        rowProps.className = this.prepareRowClassName(props, rowProps, this.state)

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

        this.mouseOverChange = true

        // return
        this.setState({
            mouseOverKey: index
        }, function(){
            this.mouseOverChange = false
        })

        ;(prevFn || emptyFn)(item, index, rowProps)
    },

    handleRowMouseOut: function(item, index, props, key, rowProps, prevFn){
        this.mouseOverChange = true

        // return
        this.setState({
            mouseOverKey: undefined
        }, function(){
            this.mouseOverChange = false
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