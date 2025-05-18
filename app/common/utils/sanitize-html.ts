import sanitizeHtml from 'sanitize-html'

export const sanitizeInputHtml = (dirtyHtml: string): string => {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: ['p', 'a', 'strong', 'i', 'code'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
    allowedSchemes: ['http', 'https'],
  })
}
