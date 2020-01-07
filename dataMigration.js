const fs = require('fs')
const file = fs.readFileSync('./data.db')
const fileData = JSON.parse(file.toString() || '{}')
fileData.mappings = fileData.mappings.map(string => string.toLowerCase())
const fileDataString = `${JSON.stringify(fileData, null, 2)}`
fs.writeFile('./data.db', fileDataString, err => {
  if (err) {
    return console.log('writing to DB failed', err)
  }
})
