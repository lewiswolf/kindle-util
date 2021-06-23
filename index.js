'use strict'
/*
Converts a My Clippings.txt file into a JSON, markdown or .txt file.
*/
const Clippings = require('./utils')

// parse args
const args = Clippings.checkArgs()

// import file
let json = Clippings.file2JSON('./input/My Clippings.txt')

// organise by book
json = Clippings.organiseHighlights(json)

// export everything
args.json && Clippings.exportJSON(json)
args.md && Clippings.exportMD(json)
args.txt && Clippings.exportTXT(json)