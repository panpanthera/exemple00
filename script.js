const elements = document.querySelectorAll('.element');
const image = document.getElementById('image');
const imageContainer = document.querySelector('.image-container');

// Event listeners for mouse enter and mouse leave
elements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    const imageSrc = element.querySelector('img').src;
    image.src = imageSrc;
    imageContainer.style.display = 'block';
  });

  element.addEventListener('mouseleave', () => {
    imageContainer.style.display = 'none';
  });
});
