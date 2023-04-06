fetch('https://lol.fandom.com/wiki/CBLOL/2023_Season/Split_1')
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const title = doc.querySelector('title').textContent
    console.log(title)
  })
  .catch(error => {
    console.log(error)
  });