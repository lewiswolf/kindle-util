'use strict'
const Clippings = require('./utils')

// parse args
const args = Clippings.checkArgs()

// import file
const txt = (() => {
    let file
    try {
        file = fs.readFileSync('./My Clippings.txt', 'utf8')
    }
    catch {
        console.log('No \'My Clippings.txt\' file present in the root directory.')
        process.exit()
    }
    return file
})()

// parse to object
let json = Clippings.file2JSON(txt)

// organise by book
json = Clippings.sortByBook(json)

// export everything
args.json && Clippings.exportJSON(json)
args.md && Clippings.exportMD(json)
args.txt && Clippings.exportTXT(json)