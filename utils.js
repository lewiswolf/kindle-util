'use strict'
const fs = require('fs')

module.exports.checkArgs = () => {
    const arr = process.argv.slice(2)
    let obj = {
        json: false,
        md: false,
        txt: false
    }
    if (!arr.length) {
        console.log(`Please provide an argument... 
--json      Export as JSON
--md        Export as Markdown
--txt       Export as txt`)
        process.exit()
    }
    for (let arg of arr) {
        switch (arg) {
            case '--json':
            case '-j':
                obj.json = true
                break
            case '--md':
            case '-m':
                obj.md = true
                break
            case '--txt':
            case '-t':
                obj.txt = true
                break
            default:
                break
        }
    }
    return obj
}

module.exports.file2JSON = (file) => {
    let arr = file.split('==========').filter(r => r !== '\r\n')
    let json = arr.map((item, i) => {
        item = item.split('\r\n')
        i === 0 && item.unshift('')
        let date = item[2].split(' ')
        let pageNumber = parseInt(date[5].split('-')[0])
        date = new Date(`${date[date.length - 3]} ${date[date.length - 4]}, ${date[date.length - 2]} ${date[date.length - 1]}`)
        return {
            title: item[1].trim(),
            date,
            pageNumber,
            authors: item[3],
            content: item[4]
        }
    })
    return json
}

module.exports.sortByBook = (json) => {
    let obj = {}
    for (let item of json) {
        if (Object.keys(obj).indexOf(item.title) < 0) {
            obj[item.title] = [{ date: item.date, pageNumber: item.pageNumber, content: item.content }]
        } else {
            obj[item.title].push({ date: item.date, pageNumber: item.pageNumber, content: item.content })
        }
    }
    return obj
}

module.exports.exportJSON = (json) => fs.writeFileSync('./output/my-clippings.json', JSON.stringify(json, null, 2))

module.exports.exportMD = (json) => {
    for (let key of Object.keys(json)) {
        let arr = json[key]
        arr = arr.sort((a, b) => a.pageNumber > b.pageNumber || b.date - a.date);
        let md = ''
        for (let quote of arr) {
            md += `<span style="color:lightcoral">Page ${quote.pageNumber}</span>:   
    ${quote.content} \n\n`
        }
        fs.writeFileSync(`./output/${key}.md`, md)
    }
}

module.exports.exportTXT = (json) => {
    for (let key of Object.keys(json)) {
        let arr = json[key]
        arr = arr.sort((a, b) => a.pageNumber > b.pageNumber || b.date - a.date);
        let txt = ''
        for (let quote of arr) {
            txt += `Page ${quote.pageNumber}:   
    ${quote.content} \n\n`
        }
        fs.writeFileSync(`./output/${key}.txt`, txt)
    }
}