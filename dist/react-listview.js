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
	var LoadMask = __webpack_require__(5)
	var Title = __webpack_require__(2)
	var TitleFactory = React.createFactory(Title)
	var Row = __webpack_require__(3)
	var RowFactory = React.createFactory(Row)
	var assign   = __webpack_require__(4)

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

	    propTypes: {
	        renderText: React.PropTypes.func,
	        title     : stringOrNumber,
	        rowHeight : stringOrNumber,
	        rowStyle  : React.PropTypes.object,

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
	        return {}
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
	            React.createElement("div", {ref: "listWrap", className: "z-list-wrap", style: props.listWrapStyle}, 
	                React.createElement("div", {className: "z-scroller"}, 
	                    this.renderList(props, state)
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

	    renderList: function(props, state) {

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
	                empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state))
	            )
	        )
	    },

	    renderEmpty: function(props) {
	        return React.createElement("li", {className: "z-row-empty"}, props.loading? props.loadingText: props.emptyText)
	    },

	    renderRow: function(props, state, item, index, arr) {
	        var key  = item[props.idProperty]
	        var text = item[props.displayProperty]

	        if (typeof props.renderText == 'function'){
	            text = props.renderText(text, item, index, props)
	        }

	        var rowClassName = ''

	        if (props.selected && props.selected[key]){
	            rowClassName += ' z-selected'
	        }

	        if (state.mouseOverKey === key){
	            rowClassName += ' z-over'
	        }

	        var rowProps = {
	            key      : key,
	            style    : props.rowStyle,
	            'data-row-id': key,
	            index    : index,
	            first    : index === 0,
	            last     : index === arr.length - 1,
	            item     : item,
	            className: rowClassName,
	            onClick  : this.handleRowClick.bind(this, item, index, props),
	            children : text
	        }

	        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

	        rowProps.className = this.prepareRowClassName(rowProps, this.state)

	        if (props.rowFactory){
	            rowProps.onMouseOver = this.handleRowMouseOver.bind(this, item, index, props, key)
	            rowProps.onMouseOut  = this.handleRowMouseOut.bind(this, item, index, props, key)
	        }

	        return (props.rowFactory || RowFactory)(rowProps)
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(4)

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
	var assign = __webpack_require__(4)

	module.exports = React.createClass({

	    displayName: 'ReactListView.Row',

	    render: function() {

	        var props = this.prepareProps(this.props, this.state)

	        return React.createElement("li", React.__spread({},  props))
	    },

	    getInitialState: function() {
	        return {}
	    },

	    prepareProps: function(thisProps, state) {
	        var props = {}

	        assign(props, thisProps)

	        props.onMouseOver = this.handleMouseOver
	        props.onMouseOut  = this.handleMouseOut

	        props.className = this.prepareClassName(props, state)

	        return props

	    },

	    prepareClassName: function(props, state) {
	        var index = props.index

	        var className = props.className || ''

	        if (state.mouseOver || props.mouseOver){
	            className += ' z-over'
	        }

	        return className
	    },

	    handleMouseOver: function() {
	        this.setState({
	            mouseOver: true
	        })
	    },

	    handleMouseOut: function() {
	        this.setState({
	            mouseOver: false
	        })
	    }
	})

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(7)
	var Loader = __webpack_require__(6)

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(7)

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
/* 7 */
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


/***/ }
/******/ ])
});
