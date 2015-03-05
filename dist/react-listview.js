(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactListView"] = factory(require("React"));
	else
		root["ReactListView"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React    = __webpack_require__(1)
	var LoadMask = __webpack_require__(13)

	var Title = __webpack_require__(2)
	var TitleFactory = React.createFactory(Title)

	var Row = __webpack_require__(3)
	var RowFactory = React.createFactory(Row)

	var sorty     = __webpack_require__(11)
	var assign    = __webpack_require__(12)
	var normalize = __webpack_require__(15)

	var classes             = __webpack_require__(4)
	var findIndexByProperty = __webpack_require__(5)
	var getSelected         = __webpack_require__(6)
	var PropTypes   = React.PropTypes

	var stringOrNumber = PropTypes.oneOfType([
	    PropTypes.number,
	    PropTypes.string
	])

	function emptyFn(){}

	var scrollToRowIfNeeded = __webpack_require__(7)

	var DISPLAY_NAME     = 'ReactListView'
	var MAX_SCREEN_SIZE  = Math.max(window.screen.height, window.screen.width)
	var BUFFER_ROW_COUNT = Math.ceil(MAX_SCREEN_SIZE / 12)

	var SIZING_ID = '___SIZING___'

	module.exports = React.createClass({

	    displayName: DISPLAY_NAME,

	    mixins: [
	        __webpack_require__(8),
	        __webpack_require__(9),
	        __webpack_require__(10)
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
	                margin: 5
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

	        window.list = this
	        var state = this.state
	        var props = this.prepareProps(this.props)
	        var title = this.renderTitle(props, state)
	        var body  = this.renderBody(props, state)

	        return (
	            React.createElement("div", React.__spread({},  props, {data: null}), 
	                title, 
	                body
	            )
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
	        var rowHeight = this.prepareRowHeight(props)

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
	            return React.createElement("span", {style: props.sortArrowStyle, 'data-sort-dir': props.sortDirection}, 
	                arrow
	            )
	        }
	    },

	    renderBody: function(props, state) {

	        var bodyClassName = props.bodyClassName || ''

	        bodyClassName += ' z-body'

	        return (
	            React.createElement("div", {className: bodyClassName, style: props.bodyStyle}, 
	                this.renderListWrap(props, state), 
	                React.createElement(LoadMask, {visible: props.loading})
	            )
	        )
	    },

	    renderListWrap: function(props, state) {
	        return (
	            React.createElement("div", {className: "z-list-wrap", style: props.listWrapStyle, ref: "scrollTarget", onScroll: this.handleScroll.bind(this, props)}, 
	                React.createElement("div", {'data-display-name': "scroller", style: {position: 'relative', width: '100%'}}, 
	                    this.renderList(props, state)
	                )
	            )
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

	            before = React.createElement("div", {style: {height: props.beforeHeight, width: 1}})
	            after  = React.createElement("div", {style: {height: props.afterHeight, width: 1}})

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
	            React.createElement("ul", {className: className, style: props.listTagStyle}, 
	                before, 
	                sizingRow, 
	                empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state, selected)), 
	                after
	            )
	        )
	    },

	    renderEmpty: function(props) {
	        return React.createElement("li", {className: "z-row-empty", style: props.emptyTextStyle}, props.loading? props.loadingText: props.emptyText)
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(12)

	module.exports = React.createClass({

	    displayName: 'ReactListView.Title',

	    getDefaultProps: function() {
	        return {
	            title: ''
	        }
	    },

	    render: function() {
	        var props = this.prepareProps(this.props)

	        return React.createElement("div", React.__spread({},  props))
	    },

	    prepareProps: function(thisProps) {
	        var props = {}

	        assign(props, thisProps)

	        return props
	    }
	})

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(12)
	var normalize = __webpack_require__(15)

	var DISPLAY_NAME = 'ReactListView.Row'

	module.exports = React.createClass({

	    displayName: DISPLAY_NAME,

	    getDefaultProps: function() {
	        return {
	            defaultStyle: null,
	            style       : null
	        }
	    },

	    render: function() {

	        var props = this.prepareProps(this.props, this.state)

	        return React.createElement("li", React.__spread({},  props, {data: null}))
	    },

	    getInitialState: function() {
	        return {}
	    },

	    xshouldComponentUpdate: function(nextProps){
	        var updateOnOverChange
	        var updateOnSelectedChange

	        if (nextProps.mouseOverChange){
	            updateOnOverChange = nextProps.mouseOver != this.props.mouseOver
	        }

	        if (nextProps.selectedChange){
	            updateOnSelectedChange = nextProps.selected != this.props.selected
	        }

	        if (updateOnSelectedChange !== undefined || updateOnOverChange !== undefined){
	            return updateOnSelectedChange || updateOnOverChange || false
	        }

	        return true
	    },

	    prepareProps: function(thisProps, state) {
	        var props = {}

	        assign(props, thisProps)

	        props.style = this.prepareStyle(props, state)

	        props.onMouseEnter = this.handleMouseOver
	        props.onMouseLeave  = this.handleMouseOut

	        props.className = this.prepareClassName(props, state)

	        return props

	    },

	    prepareStyle: function(props, state) {
	        return normalize(assign({}, props.defaultStyle, props.style))
	    },

	    prepareClassName: function(props, state) {
	        var index = props.index

	        var className = props.className || ''

	        if (state.mouseOver || props.mouseOver){
	            className += ' z-over'
	        }

	        return className
	    },

	    handleMouseOver: function(event) {

	        this.setState({
	            mouseOver: true
	        })

	        if (this.props.onMouseEnter){
	            this.props.onMouseEnter(this.props, event)
	        }
	    },

	    handleMouseOut: function(event) {
	        this.setState({
	            mouseOver: false
	        })

	        if (this.props.onMouseLeave){
	            this.props.onMouseLeave(this.props, event)
	        }
	    }
	})

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function notEmpty(x){
	    return !!x
	}

	module.exports = function(){
	    return Array.prototype.filter.call(arguments, notEmpty).join(' ')
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var findIndexBy = __webpack_require__(14)

	function findIndexByProperty(arr, name, value){
	    return findIndexBy(arr, function(info){
	        return info[name] === value
	    })
	}

	module.exports = findIndexByProperty

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(props, state){
	    var selected = props.selected == null?
	                        state.defaultSelected
	                        :
	                        props.selected

	    return selected
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign      = __webpack_require__(12)
	var getSelected = __webpack_require__(6)
	var hasOwn      = function(obj, prop){
	    return Object.prototype.hasOwnProperty.call(obj, prop)
	}

	/**
	 * Here is how multi selection is implemented - trying to emulate behavior in OSX Finder
	 *
	 * When there is no selection, and an initial click for selection is done, keep that index (SELINDEX)
	 *
	 * Next, if we shift+click, we mark as selected the items from initial index to current click index.
	 *
	 * Now, if we ctrl+click elsewhere, keep the selection, but also add the selected file,
	 * and set SELINDEX to the new index. Now on any subsequent clicks, have the same behavior,
	 * selecting/deselecting items starting from SELINDEX to the new click index
	 */


	module.exports = {

	    findInitialSelectionIndex: function(){
	        var selected = getSelected(this.props, this.state)
	        var index = undefined

	        if (!Object.keys(selected).length){
	            return index
	        }


	        var i = 0
	        var data = this.data
	        var len = data.length
	        var id
	        var idProperty = this.props.idProperty

	        for (; i < len; i++){
	            id = data[i][idProperty]

	            if (selected[id]){
	                index = i
	            }
	        }

	        return index
	    },

	    notifySelection: function(selected, data){
	        if (typeof this.props.onSelectionChange == 'function'){
	            this.props.onSelectionChange(selected, data)
	        }

	        if (!hasOwn(this.props, 'selected')){

	            this.setState({
	                defaultSelected: selected
	            })
	        }
	    },

	    handleSingleSelection: function(data, event){
	        var props = this.props

	        var rowSelected = this.isRowSelected(data)
	        var newSelected = !rowSelected

	        if (rowSelected && event && !event.ctrlKey){
	            //if already selected and not ctrl, keep selected
	            newSelected = true
	        }

	        var selectedId = newSelected?
	                            data[props.idProperty]:
	                            null

	        this.notifySelection(selectedId, data)
	    },


	    handleMultiSelection: function(data, event, config){

	        var selIndex = config.selIndex
	        var prevShiftKeyIndex = config.prevShiftKeyIndex

	        var props = this.props
	        var map   = selIndex == null?
	                        {}:
	                        assign({}, getSelected(props, this.state))

	        if (prevShiftKeyIndex != null && selIndex != null){
	            var min = Math.min(prevShiftKeyIndex, selIndex)
	            var max = Math.max(prevShiftKeyIndex, selIndex)

	            var removeArray = this.data.slice(min, max + 1) || []

	            removeArray.forEach(function(item){
	                if (item){
	                    var id = item[props.idProperty]
	                    delete map[id]
	                }
	            })
	        }

	        data.forEach(function(item){
	            if (item){
	                var id = item[props.idProperty]
	                map[id] = item
	            }
	        })

	        this.notifySelection(map, data)
	    },

	    handleMultiSelectionRowToggle: function(data, event){

	        var selected   = getSelected(this.props, this.state)
	        var isSelected = this.isRowSelected(data)

	        var clone = assign({}, selected)
	        var id    = data[this.props.idProperty]

	        if (isSelected){
	            delete clone[id]
	        } else {
	            clone[id] = data
	        }

	        this.notifySelection(clone, data)

	        return isSelected
	    },

	    handleSelection: function(rowProps, event){

	        var props = this.props

	        if (!hasOwn(props, 'selected') && !hasOwn(props, 'defaultSelected')){
	            return
	        }

	        var isSelected  = this.isRowSelected(rowProps.data)
	        var multiSelect = this.isMultiSelect()

	        if (!multiSelect){
	            this.handleSingleSelection(rowProps.data, event)
	            return
	        }

	        if (this.selIndex === undefined){
	            this.selIndex = this.findInitialSelectionIndex()
	        }

	        var selIndex = this.selIndex

	        //multi selection
	        var index = rowProps.index
	        var prevShiftKeyIndex = this.shiftKeyIndex
	        var start
	        var end
	        var data

	        if (event.ctrlKey){
	            this.selIndex = index
	            this.shiftKeyIndex = null

	            var unselect = this.handleMultiSelectionRowToggle(this.data[index], event)

	            if (unselect){
	                this.selIndex++
	                this.shiftKeyIndex = prevShiftKeyIndex
	            }

	            return
	        }

	        if (!event.shiftKey){
	            //set selIndex, for future use
	            this.selIndex = index
	            this.shiftKeyIndex = null

	            //should not select many, so make selIndex null
	            selIndex = null
	        } else {
	            this.shiftKeyIndex = index
	        }

	        if (selIndex == null){
	            data = [this.data[index]]
	        } else {
	            start = Math.min(index, selIndex)
	            end   = Math.max(index, selIndex) + 1
	            data  = this.data.slice(start, end)
	        }

	        this.handleMultiSelection(data, event, {
	            selIndex: selIndex,
	            prevShiftKeyIndex: prevShiftKeyIndex
	        })
	    },


	    isRowSelected: function(data){
	        var selectedMap = this.getSelectedMap()
	        var id          = data[this.props.idProperty]

	        return selectedMap[id]
	    },

	    isMultiSelect: function(){
	        var selected = getSelected(this.props, this.state)

	        return selected && typeof selected == 'object'
	    },

	    getSelectedMap: function(){
	        var selected    = getSelected(this.props, this.state)
	        var multiSelect = selected && typeof selected == 'object'
	        var map

	        if (multiSelect){
	            map = selected
	        } else {
	            map = {}
	            map[selected] = true
	        }

	        return map
	    }
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign    = __webpack_require__(12)
	var normalize = __webpack_require__(15)

	module.exports = {

	    prepareStyles: function(props) {
	        props.style          = this.prepareStyle(props)
	        props.titleStyle     = this.prepareTitleStyle(props)
	        props.bodyStyle      = this.prepareBodyStyle(props)
	        props.listWrapStyle  = this.prepareListWrapStyle(props)
	        this.prepareRowStyles(props)
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

	    prepareRowStyles: function(props) {
	        props.rowStyle = this.prepareRowStyle(props)

	        props.overRowStyle     = normalize(assign({}, props.defaultOverRowStyle, props.overRowStyle))
	        props.selectedRowStyle = normalize(assign({}, props.defaultSelectedRowStyle, props.selectedRowStyle))
	        props.overSelectedRowStyle = normalize(assign(props.defaultOverSelectedRowStyle, props.overSelectedRowStyle))

	        props.lastRowStyle = assign({}, props.defaultLastRowStyle, props.lastRowStyle)
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign    = __webpack_require__(12)
	var normalize = __webpack_require__(15)

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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16)

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(22)
	var Loader = __webpack_require__(21)

	module.exports = React.createClass({

	    displayName: 'LoadMask',

	    getDefaultProps: function(){

	        return {
	            visibleDisplayValue: 'block',
	            defaultStyle: {
	                position: 'absolute',
	                width   : '100%',
	                height  : '100%',
	                display : 'none',
	                top: 0,
	                left: 0
	            }
	        }
	    },

	    render: function(){
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' loadmask'

	        return React.DOM.div(props, React.createElement(Loader, {size: props.size}))
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.display = props.visible?
	                        props.visibleDisplayValue:
	                        'none'

	        props.style = style
	    }
	})

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function findIndexBy(arr, fn){

	    var i   = 0
	    var len = arr.length

	    for (; i < len; i++){
	        if (fn(arr[i]) === true){
	            return i
	        }
	    }

	    return -1
	}

	module.exports = findIndexBy

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn      = __webpack_require__(17)
	var getPrefixed = __webpack_require__(18)

	var map      = __webpack_require__(19)
	var plugable = __webpack_require__(20)

	function plugins(key, value){

		var result = {
			key  : key,
			value: value
		}

		;(RESULT.plugins || []).forEach(function(fn){

			var tmp = map(function(res){
				return fn(key, value, res)
			}, result)

			if (tmp){
				result = tmp
			}
		})

		return result
	}

	function normalize(key, value){

		var result = plugins(key, value)

		return map(function(result){
			return {
				key  : getPrefixed(result.key, result.value),
				value: result.value
			}
		}, result)

		return result
	}

	var RESULT = function(style){
		var k
		var item
		var result = {}

		for (k in style) if (hasOwn(style, k)){
			item = normalize(k, style[k])

			if (!item){
				continue
			}

			map(function(item){
				result[item.key] = item.value
			}, item)
		}

		return result
	}

	module.exports = plugable(RESULT)

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var curry = __webpack_require__(23)
	var TYPES = __webpack_require__(24)

	function isFn(fn){
	    return typeof fn === 'function'
	}

	var sorty = curry(function(sortInfo, array){
	    return array.sort(getMultiSortFunction(sortInfo))
	})

	sorty.types = TYPES

	var getSingleSortFunction = function(info){

	    if (!info){
	        return
	    }

	    var field = info.name
	    var dir   = info.dir === 'desc' || info.dir < 0?
	                    -1:
	                    info.dir === 'asc' || info.dir > 0?
	                        1:
	                        0

	    if (!dir){
	        return
	    }

	    if (!info.fn && info.type){
	        info.fn = sorty.types[info.type]
	    }

	    if (!info.fn){
	        info.fn = sorty.types.string || TYPES.string
	    }

	    var fn = info.fn

	    return function(first, second){
	        var a = first[field]
	        var b = second[field]

	        return dir * fn(a, b)
	    }
	}

	var getSortFunctions = function(sortInfo){
	    if (!Array.isArray(sortInfo)){
	        sortInfo = [sortInfo]
	    }

	    return sortInfo.map(getSingleSortFunction).filter(isFn)
	}

	var getMultiSortFunction = function(sortInfo){

	    var fns = getSortFunctions(sortInfo)

	    return function(first, second){
	        var result = 0
	        var i      = 0
	        var len    = fns.length
	        var fn

	        for (; i < len; i++){
	            fn = fns[i]
	            if (!fn){
	                continue
	            }

	            result = fn(first, second)

	            if (result != 0){
	                return result
	            }
	        }

	        return result
	    }
	}

	sorty._getSortFunctions = getSortFunctions
	sorty.getFunction = getMultiSortFunction

	module.exports = sorty

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop)
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getStylePrefixed = __webpack_require__(25)
	var properties       = __webpack_require__(26)

	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		return getStylePrefixed(key, value)
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(fn, item){

		if (!item){
			return
		}

		if (Array.isArray(item)){
			return item.map(fn).filter(function(x){
				return !!x
			})
		} else {
			return fn(item)
		}
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getCssPrefixedValue = __webpack_require__(27)

	module.exports = function(target){
		target.plugins = target.plugins || [
			(function(){
				var values = {
					'flex':1,
					'inline-flex':1
				}

				return function(key, value){
					if (key === 'display' && value in values){
						return {
							key  : key,
							value: getCssPrefixedValue(key, value)
						}
					}
				}
			})()
		]

		target.plugin = function(fn){
			target.plugins = target.plugins || []

			target.plugins.push(fn)
		}

		return target
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(22)

	module.exports = React.createClass({

	    displayName: 'Loader',

	    getDefaultProps: function(){
	        return {
	            defaultStyle: {
	                margin: 'auto',
	                position: 'absolute',
	                top: 0,
	                left: 0,
	                bottom: 0,
	                right: 0,
	            },
	            defaultClassName: 'loader',
	            size: 40,
	        }
	    },

	    render: function() {
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' ' + props.defaultClassName

	        return React.DOM.div(props,
	            React.createElement("div", {className: "loadbar loadbar-1"}),
	            React.createElement("div", {className: "loadbar loadbar-2"}),
	            React.createElement("div", {className: "loadbar loadbar-3"}),
	            React.createElement("div", {className: "loadbar loadbar-4"}),
	            React.createElement("div", {className: "loadbar loadbar-5"}),
	            React.createElement("div", {className: "loadbar loadbar-6"}),
	            React.createElement("div", {className: "loadbar loadbar-7"}),
	            React.createElement("div", {className: "loadbar loadbar-8"}),
	            React.createElement("div", {className: "loadbar loadbar-9"}),
	            React.createElement("div", {className: "loadbar loadbar-10"}),
	            React.createElement("div", {className: "loadbar loadbar-11"}),
	            React.createElement("div", {className: "loadbar loadbar-12"})
	        )
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.width = props.size
	        style.height = props.size

	        props.style = style
	    }
	})

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    string: function(a, b){

	        a += ''
	        b += ''

	        return a.localeCompare(b)
	    },

	    number: function(a, b) {
	        return a - b
	    }
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(28)
	var getPrefix    = __webpack_require__(29)
	var el           = __webpack_require__(30)

	var MEMORY = {}
	var STYLE = el.style

	module.exports = function(key, value){

	    var k = key// + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed

	    if (!(key in STYLE)){//we have to prefix

	        prefix = getPrefix('appearance')

	        if (prefix){
	            prefixed = prefix + toUpperFirst(key)

	            if (prefixed in STYLE){
	                key = prefixed
	            }
	        }
	    }

	    MEMORY[k] = key

	    return key
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  'alignItems': 1,
	  'justifyContent': 1,
	  'flex': 1,
	  'flexFlow': 1,

	  'userSelect': 1,
	  'transform': 1,
	  'transition': 1,
	  'transformOrigin': 1,
	  'transformStyle': 1,
	  'transitionProperty': 1,
	  'transitionDuration': 1,
	  'transitionTimingFunction': 1,
	  'transitionDelay': 1,
	  'borderImage': 1,
	  'borderImageSlice': 1,
	  'boxShadow': 1,
	  'backgroundClip': 1,
	  'backfaceVisibility': 1,
	  'perspective': 1,
	  'perspectiveOrigin': 1,
	  'animation': 1,
	  'animationDuration': 1,
	  'animationName': 1,
	  'animationDelay': 1,
	  'animationDirection': 1,
	  'animationIterationCount': 1,
	  'animationTimingFunction': 1,
	  'animationPlayState': 1,
	  'animationFillMode': 1,
	  'appearance': 1
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getPrefix     = __webpack_require__(29)
	var forcePrefixed = __webpack_require__(31)
	var el            = __webpack_require__(30)

	var MEMORY = {}
	var STYLE = el.style

	module.exports = function(key, value){

	    var k = key + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed
	    var prefixedValue

	    if (!(key in STYLE)){

	        prefix = getPrefix('appearance')

	        if (prefix){
	            prefixed = forcePrefixed(key, value)

	            prefixedValue = '-' + prefix.toLowerCase() + '-' + value

	            if (prefixed in STYLE){
	                el.style[prefixed] = ''
	                el.style[prefixed] = prefixedValue

	                if (el.style[prefixed] !== ''){
	                    value = prefixedValue
	                }
	            }
	        }
	    }

	    MEMORY[k] = value

	    return value
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(str){
		return str?
				str.charAt(0).toUpperCase() + str.slice(1):
				''
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(28)
	var prefixes     = ["ms", "Moz", "Webkit", "O"]

	var el = __webpack_require__(30)

	var PREFIX

	module.exports = function(key){

		if (PREFIX){
			return PREFIX
		}

		var i = 0
		var len = prefixes.length
		var tmp
		var prefix

		for (; i < len; i++){
			prefix = prefixes[i]
			tmp = prefix + toUpperFirst(key)

			if (typeof el.style[tmp] != 'undefined'){
				return PREFIX = prefix
			}
		}
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var el

	if(!!global.document){
	  	el = global.document.createElement('div')
	}

	module.exports = el
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(28)
	var getPrefix    = __webpack_require__(29)
	var properties   = __webpack_require__(26)

	/**
	 * Returns the given key prefixed, if the property is found in the prefixProps map.
	 *
	 * Does not test if the property supports the given value unprefixed.
	 * If you need this, use './getPrefixed' instead
	 */
	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		var prefix = getPrefix(key)

		return prefix?
					prefix + toUpperFirst(key):
					key
	}

/***/ }
/******/ ])
});
