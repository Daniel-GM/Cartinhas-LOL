document.addEventListener("DOMContentLoaded", function () {
  const checkMvp = document.querySelector('#checkMvp')
  const checkDreamTeam = document.querySelector('#checkDreamTeam')
  const checkTimes = document.querySelector('#checkTimes')
  // const checkRegiao = document.querySelector('#checkRegiao')

  checkMvp.addEventListener('change', () => {
    const div = document.querySelector('#divMvp')
    changeDisplay(checkMvp, div)
  })

  checkDreamTeam.addEventListener('change', () => {
    const div = document.querySelector('#divDreamTeam')
    changeDisplay(checkDreamTeam, div)
  })

  checkTimes.addEventListener('change', () => {
    const div = document.querySelector('#times')
    changeDisplay(checkTimes, div)
  })
  // checkMvp.addEventListener('change', () => {
  //   const div = document.querySelector('#divMvp')
  //   changeDisplay(this, div)
  // })


  function changeDisplay(checkbox, div) {
    if (checkbox.checked) {
      div.classList.remove('d-none');
      div.classList.add('d-flex');
    } else {
      div.classList.remove('d-flex');
      div.classList.add('d-none');
    }
  }
})