fetch('https://gol.gg/players/player-stats/1114/season-S13/split-Spring/tournament-ALL/champion-ALL/')
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