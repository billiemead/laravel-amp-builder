
// return all text nodes that are contained within `el`
function getTextNodes(el) {
  el = el || document.body

  var doc = el.ownerDocument || document
    , walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
    , textNodes = []
    , node

  while (node = walker.nextNode()) {
    textNodes.push(node)
  }
  return textNodes
}

// return true if `rangeA` intersects `rangeB`
function rangesIntersect(rangeA, rangeB) {
  return rangeA.compareBoundaryPoints(Range.END_TO_START, rangeB) === -1 &&
    rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB) === 1
}

// create and return a range that selects `node`
function createRangeFromNode(node) {
  var range = node.ownerDocument.createRange()
  try {
    range.selectNode(node)
  } catch (e) {
    range.selectNodeContents(node)
  }
  return range
}

// return true if `node` is fully or partially selected by `range`
function rangeIntersectsNode(range, node) {
  if (range.intersectsNode) {
    return range.intersectsNode(node)
  } else {
    return rangesIntersect(range, createRangeFromNode(node))
  }
}

// return all non-empty text nodes fully or partially selected by `range`
function getRangeTextNodes(range) {
  var container = range.commonAncestorContainer
    , nodes = getTextNodes(container.parentNode || container)

  return nodes.filter(function (node) {
    return rangeIntersectsNode(range, node) && isNonEmptyTextNode(node)
  })
}

// returns true if `node` has text content
function isNonEmptyTextNode(node) {
  return node.textContent.length > 0
}

// remove `el` from the DOM
function remove(el) {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

// replace `node` with `replacementNode`
function replaceNode(replacementNode, node) {
  remove(replacementNode)
  node.parentNode.insertBefore(replacementNode, node)
  remove(node)
}

// unwrap `el` by replacing itself with its contents
function unwrap(el) {
  var range = document.createRange()
  range.selectNodeContents(el)
  replaceNode(range.extractContents(), el)
}

// undo the effect of `wrapRangeText`, given a resulting array of wrapper `nodes`
function undo(nodes) {
  nodes.forEach(function (node) {
    var parent = node.parentNode
    unwrap(node)
    parent.normalize()
  })
}
function nodeAlreadyWrapped(node, tag)
{
	if(node.parentNode){
		return node.parentNode.tagName == tag
	}
	return false;
}
// create a node wrapper function
function createWrapperFunction(wrapperEl, range) {
    var startNode = range.startContainer
      , endNode = range.endContainer
      , startOffset = range.startOffset
      , endOffset = range.endOffset

  return function wrapNode(node) {
    var currentRange = document.createRange()
      , currentWrapper = wrapperEl.cloneNode()
    currentRange.selectNodeContents(node)

    if (node === startNode && startNode.nodeType === 3) {
      currentRange.setStart(node, startOffset)
      startNode = currentWrapper
      startOffset = 0
    }
    if (node === endNode && endNode.nodeType === 3) {
      currentRange.setEnd(node, endOffset)
      endNode = currentWrapper
      endOffset = 1
    }
	if( nodeAlreadyWrapped(node, wrapperEl.tagName)){
		  return;
	  }
    currentRange.surroundContents(currentWrapper)
    return currentWrapper
  }
}
function getSiblingRanges(node, range)
{
	var leftRange, rightRange;
	var startOffset = range.startOffset
      , endOffset = range.endOffset;
	leftRange = document.createRange();
	rightRange = document.createRange()
	leftRange.selectNodeContents(node), rightRange.selectNodeContents(node);
	leftRange.setStart(node, 0), leftRange.setEnd(node, startOffset);
	rightRange.setStart(node, endOffset),rightRange.setEnd(node, node.textContent.length);
	return [leftRange, rightRange];
}
function unwrapRange(node, range, wrapperEl)
{
	var wrapperObj = {nodes:[]};
	var wrapNode, nodes, currentWrapper;
	var ranges = getSiblingRanges(node, range);
	for(var i in ranges){
		if (range.collapsed || range.isCollapsed)		continue;
		currentWrapper = wrapperEl.cloneNode();
		
		ranges[i].surroundContents(currentWrapper)
		wrapperObj.nodes.push(currentWrapper);
		
	}
	var parentNode = node.parentNode;
	unwrap(parentNode);
	wrapperObj.unwrap = function () {
		if (this.nodes.length) {
			undo(this.nodes)
			this.nodes = []
		}
	}
	
	return wrapperObj
	
	
	
}
function wrapRangeText(wrapperEl, range) {
  var nodes
    , wrapNode
    , wrapperObj = {}

  if (typeof range === 'undefined') {
    // get the current selection if no range is specified
    range = window.getSelection().getRangeAt(0)
  }

  if (range.collapsed || range.isCollapsed) {
    // nothing to wrap
    return []
  }

  if (typeof wrapperEl === 'undefined') {
    wrapperEl = 'span'
  }

  if (typeof wrapperEl === 'string') {
    // assume it's a tagname
    wrapperEl = document.createElement(wrapperEl)
  }

  

  nodes = getRangeTextNodes(range)
  if(nodes.length == 1 && nodeAlreadyWrapped(nodes[0], wrapperEl.tagName)){
	  return unwrapRange(nodes[0], range, wrapperEl);  
  }
  wrapNode = createWrapperFunction(wrapperEl, range)
  nodes = nodes.map(wrapNode)

  wrapperObj.nodes = nodes
  wrapperObj.unwrap = function () {
    if (this.nodes.length) {
      undo(this.nodes)
      this.nodes = []
    }
  }

  return wrapperObj
}

module.exports = wrapRangeText
