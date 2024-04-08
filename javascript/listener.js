document.querySelectorAll('.cardComplete').forEach(card => {
    card.addEventListener('click', function() {
      card.classList.toggle('flipped');
    });
  });