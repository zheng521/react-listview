react-listview
==============

> React ListView

## Install

```sh
$ npm install react-listview --save
```


## Usage

```jsx
<ListView data={data} />
```

## Props

 * data - the array of data to show in the list
 * idProperty - the property of each array item that can be used as an id
 * displayProperty - the property of each array item that should be rendered
 * renderText: Function - custom display function - called for each row
 * title: 'String' - if specified, a list title will be shown

 * loading: Boolean - use this to show a loading mask over the list
 * emptyText: String - defaults to 'No records'
 * loadingText: String - emptyText to be used when you have loading: true


### Sorting props

 * sortable: Boolean - defaults to true
 * sortDirection - 1 (or 'asc'), -1 (or 'desc'), other for none
 * defaultSortDirection - if you want sorting to be done by the ListView component
 * onSortChange: Function(newDir) - called when the user clicks the title, so a sort action should be triggered

### Selection props

 * selected: Object/string/number - if an object, multiple selection is allowed, otherwise, single selection. For multiple selection, the keys of the `selected` property should be the ids of the selected rows (see `idProperty`). For single selection, `selected` should be a row id (value from `idProperty`)
 * defaultSelected - stateful alternative of `selected`
 * onSelectionChange: Function(newSelected)

### Styling props

 * emptyTextStyle
 * emptyStyle - style applied to the whole ListView when there is no item in the data array

### Row styling

 * rowStyle: Object/Function
 * selectedRowStyle: Object
 * overRowStyle: Object
 * overSelectedRowStyle: Object
 * rowHeight: Number - defaults to null
 * rowBorder: String/Boolean You can specify rowBorder:false in order not to show row borders
