'use strict'
const pdfreader = require('pdfreader')
const path = require('path')

const Utils = require('./utils')

const parsePdf = async (file) => {
	/* 
	Imports a pdf file and returns JSON.
	Made with pdfreader.
	*/

	return await new Promise((resolve, reject) => {
		let pdf = []
		let rows = []
		let coords = []

		new pdfreader.PdfReader().parseFileItems(file, (err, item) => {
			err && reject(err)
			!item && resolve(pdf)

			// after starting a new page, add previous text to the 
			// pdf object, then clear.
			if (item?.page !== undefined) {
				pdf.push({
					pageNumber: item.page,
					text: rows,
					coords,
				})
				rows = []
			}

			// Accumulate rows of text
			if (item?.text) {
				if (coords.length - 1 >= 0 && coords[coords.length - 1].y === item.y)
					rows[rows.length - 1] = `${rows[rows.length - 1]}${item.text[item.text.length - 1] === ' ' ? item.text.slice(0, -1) : item.text}`
				else {
					coords.push({ x: item.x, y: item.y, w: item.w, sw: item.sw, })
					rows.push(item.text.slice(0, -1))
				}
			}
		})
	})
}



const highlight = async (json) => {
	for (let book in json) {
		let pdf = await parsePdf(path.join(__dirname, `../input/${book}.pdf`)).catch((e) => console.log(e))
		console.log(pdf[10])
	}
}

module.exports = highlight
