exports.siteName = 'ИмпортТехСервис'

exports.cutString = (str, maxSymbols) =>
  (str && str.length > maxSymbols ? str.slice(0, maxSymbols) + '...' : str)

exports.isImage = (buffer) => {
  const header = buffer.toString('hex', 0, 4)
  switch (header) {
    case '89504e47':
      return 'image/png'
    case '47494638':
      return 'image/gif'
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg'
    default:
      return false
  }
}
