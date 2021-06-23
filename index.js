'use strict'
const Clippings = require('./utils')
const args = Clippings.checkArgs()

let json = Clippings.file2JSON('./input/My Clippings.txt')
json = Clippings.organiseHighlights(json)

args.json && Clippings.exportJSON(json)
args.md && Clippings.exportMD(json)
args.txt && Clippings.exportTXT(json)