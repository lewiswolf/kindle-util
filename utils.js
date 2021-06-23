'use strict'
const fs = require('fs')

module.exports.checkArgs = () => {
	/*
	Loops over any arguments and returns a settings 
	object. This method assumes that an argument is 
	always provided.
	*/

	let settings = {
		json: false,
		md: false,
		txt: false
	}
	const args = process.argv.slice(2)

	// configure the settings object
	for (let arg of args) {
		switch (arg) {
			case '--json':
			case '-j':
				settings.json = true
				break
			case '--md':
			case '-m':
				settings.md = true
				break
			case '--txt':
			case '-t':
				settings.txt = true
				break
			default:
				break
		}
	}
	return settings
}

module.exports.file2JSON = (filepath) => {
	/*
	Imports a MyClippings.txt file and converts
	the metadata for each highlighted section into 
	JSON format. Returns an array of objects. 
	*/

	// import file
	let file
	try {
		file = fs.readFileSync(filepath, 'utf8')
	} catch {
		console.log('No \'My Clippings.txt\' file found.')
		process.exit()
	}

	// create array of highlights
	let arr = file.split('==========').filter(r => r !== '\r\n')

	// extract data from each highlight
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

module.exports.organiseHighlights = (json) => {
	/*
	Organises a JSON object first by book, such that 
	json = {
		book1: [
			hightlight 1, hightlight 2, ...
		]
	}
	and then organises the individual highlights by
	pagenumber, and date. 
	*/

	let obj = {}

	// organise by book
	for (let item of json) {
		if (!item.content) { continue }
		if (Object.keys(obj).indexOf(item.title) < 0) {
			obj[item.title] = [{ date: item.date, pageNumber: item.pageNumber, content: item.content }]
		} else {
			obj[item.title].push({ date: item.date, pageNumber: item.pageNumber, content: item.content })
		}
	}

	// sort by pagenumber and date
	for (let book in obj) {
		obj[book] = obj[book].sort((a, b) => a.pageNumber - b.pageNumber || a.date - b.date)
	}
	return obj
}

module.exports.exportJSON = (json) => fs.writeFileSync('./output/my-clippings.json', JSON.stringify(json, null, 2))

module.exports.exportMD = (json) => {
	/*
	Exports a stylised markdown file generated from a JSON.
	*/

	for (let key of Object.keys(json)) {
		let md = ''
		for (let quote of json[key]) {
			md += `<span style="color:lightcoral">Page ${quote.pageNumber}</span>:   
    ${quote.content} \n\n`
		}
		fs.writeFileSync(`./output/${key}.md`, md)
	}
}

module.exports.exportTXT = (json) => {
	/*
	Exports a stylised txt file generated from a JSON.
	*/

	for (let key of Object.keys(json)) {
		let txt = ''
		for (let quote of json[key]) {
			txt += `Page ${quote.pageNumber}:   
    ${quote.content} \n\n`
		}
		fs.writeFileSync(`./output/${key}.txt`, txt)
	}
}