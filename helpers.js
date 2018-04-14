exports.siteName = 'ИмпортТехСервис'

exports.cutString = (str, maxSymbols) =>
  (str && str.length > maxSymbols ? str.slice(0, maxSymbols) + '...' : str)
