export function trimQuotes(inputString = '') {
  let trimmedString = inputString

  if (trimmedString === null) trimmedString = ''
  if (trimmedString.startsWith('"')) {
    trimmedString = trimmedString.slice(1)
  }

  if (trimmedString.endsWith('"')) {
    trimmedString = trimmedString.slice(0, -1)
  }

  return trimmedString
}
