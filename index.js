'use strict'
const Highlight = require('./src/highlight.js')
const Utils = require('./src/utils')
const args = Utils.checkArgs()

let json = Utils.file2JSON('./input/My Clippings.txt')
json = Utils.organiseHighlights(json)

args.json && Utils.exportJSON(json)
args.md && Utils.exportMD(json)
args.txt && Utils.exportTXT(json);

(async () => {
	args.highlight && await Highlight(json)
})()