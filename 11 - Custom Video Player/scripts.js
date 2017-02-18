// Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
let isChangingRate = false;
let isUpdatingVideo = false;

// Build our functions
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();

    // if(video.paused) { // Only this video state exists (no video.played)
    //     video.play();
    // } else {
    //     video.pause();
    // }
}

function updateButton() {
    const icon = this.paused ? '►' : '❚❚';
    toggle.textContent = icon;
    // console.log('Update the button');
}

function skip() {
    // console.log(this.dataset);
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    if(!isChangingRate) return; //Stop the function from running when not moused down
    video[this.name] = this.value;
    // console.log(this.name);
    // console.log(this.value);
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    // console.log('offsetX: ' + e.offsetX);
    // console.log('offsetWidth: ' + progress.offsetWidth);
    //Progress bar contains certain # of pixels, progress.offsetWidth.
    //(Inside MouseEvent .offsetX represents distance clicked from the #)
    //The division gives a %, which multiplied by the video duration returns the time that current time should be updated to
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;

    // console.log('scrubTime: ' + scrubTime);
    video.currentTime = scrubTime;
}

//Add fullscreen functionality. Taken from Stack Overflow, try to develop your own
function goFullscreen(id) {
  var element = document.getElementById(id);
  if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}


// Hook up the event listeners

//Play video
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

//Change button
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

//Skip video
skipButtons.forEach(button => button.addEventListener('click', skip));

//Update Ranges. Two ways: Listen for change or listen if the mouse is being dragged along the sliders
//Check HTML5 Canvas file/video for further explanation of dynamic change in volume/speed
//Dynamic: Mouse dragged
ranges.forEach(range => range.addEventListener('mousedown', (e) =>{
    isChangingRate = true;
}));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mouseup', () => isChangingRate = false));
//Static: Value changed with one click in the slider
ranges.forEach(range => range.addEventListener('change', (e) =>{
    isChangingRate = true;
}));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

//Update progress bar
video.addEventListener('timeupdate', handleProgress);

//Changing current time of video
//Static change
progress.addEventListener('click', scrub);
//Dynamic change (similar to range, condition is checked here and not in the function)
progress.addEventListener('mousemove', (e) => isUpdatingVideo && scrub(e));
progress.addEventListener('mousedown', () => isUpdatingVideo = true);
progress.addEventListener('mouseup', () => isUpdatingVideo = false);

// progress.addEventListener('mousemove', () => {
//     if(isUpdatingVideo){
//         scrub();
//     }
// });
