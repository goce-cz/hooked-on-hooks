const fs = require('fs')
const path = require('path')

module.exports = fileName => {
  const source = fs.readFileSync(
    path.resolve('./src', fileName),
    { encoding: 'utf-8' }
  )
  return `return ${JSON.stringify(source)}`
}
