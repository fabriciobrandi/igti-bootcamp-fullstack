window.addEventListener('load', start);

function start() {
  var sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    slider.addEventListener('input', updateColor)
  });
}
function updateColor(event) {
  event.target.nextElementSibling.value = event.target.value;
  var square = document.querySelector('#square');
  var R = document.querySelector('#textR');
  var G = document.querySelector('#textG');
  var B = document.querySelector('#textB');
  var strRgb = "rgb(" + R.value + "," + G.value + "," + B.value + ")";

  square.style.background = strRgb;
}