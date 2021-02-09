'use strict'
const fs = require('fs')
const Clippings = require('./utils')

// parse args
const args = Clippings.checkArgs()
// import file
const txt = fs.readFileSync('./My Clippings.txt', 'utf8')
// split by highlight
const arr = txt.split('==========').filter(r => r !== '\r\n')
// parse to object
let json = arr.map((hl, i) => {
    let item = hl.split('\r\n')
    i === 0 && item.unshift('')
    let date = item[2].split(' ')
    let pageNumber = parseInt(date[5].split('-')[0])
    date = new Date(`${date[date.length - 3]} ${date[date.length - 4]}, ${date[date.length - 2]} ${date[date.length - 1]}`)
    return {
        title: item[1],
        date,
        pageNumber,
        authors: item[3],
        content: item[4]
    }
})
// organise by book
json = Clippings.sortByBook(json)

args.json && fs.writeFileSync('./output/my-clippings.json', JSON.stringify(json, null, 2))
args.md && Clippings.exportMD(json)
args.txt && Clippings.exportTXT(json)