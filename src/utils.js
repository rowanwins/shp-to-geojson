export function loadFilePromise(filepath) {
  return new Promise((resolve, reject) => {
    fetch(filepath)
      .then(response => {
        if (response.ok) {
          if (responseType === 'text') return response.text()
          return response.arrayBuffer()
        } else {
          throw new Error(`Could not resolve ${filepath}`)
        }
      })
      .then(data => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function loadFileRange(filepath, responseType, Range) {
  return new Promise((resolve, reject) => {
    fetch(filepath, {
      headers: {
        Range
      }
    })
      .then(response => {
        if (response.ok) {
          if (responseType === 'text') return response.text()
          return response.arrayBuffer()
        } else {
          throw new Error(`Could not resolve ${filepath}`)
        }
      })
      .then(data => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}