const volumeSlider = document.querySelector("#volume-slider");
let previousVolume = 1;
const muteImg = document.querySelector("#mute-img");
const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBar = document.querySelector("#progress-bar-fill");

const muteBtn = document.querySelector("#mute-btn");
const fullscreenBtn = document.querySelector("#fullscreen-btn");
const progressTrack = document.querySelector(".progress-bar");
const videoContainer = document.querySelector(".video-container");
const videoPlaceholder = document.querySelector(".video-placeholder");

const navButtons = document.querySelectorAll(".nav-button");
const infoViews = document.querySelectorAll(".info-view");

video.removeAttribute("controls");

/*
  The native browser controls are removed so that the interface
  can use the assignment's custom controls instead.

  MDN reference:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
*/

/*
  The play button is connected with JavaScript instead of
  using inline HTML events.

  MDN reference:
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
*/
playPauseBtn.addEventListener("click", togglePlayPause);

video.addEventListener("timeupdate", updateProgressBar);
video.addEventListener("ended", resetPlayButton);
video.addEventListener("loadeddata", hideVideoPlaceholder);

function togglePlayPause() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

/*
  The play and pause icons update according to the actual
  media state. This gives the user immediate feedback.
*/
video.addEventListener("play", () => {
  playPauseImg.src =
    "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  playPauseImg.alt = "Pause";
});

video.addEventListener("pause", () => {
  playPauseImg.src =
    "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  playPauseImg.alt = "Play";
});

function resetPlayButton() {
  playPauseImg.src =
    "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  playPauseImg.alt = "Play";
}

function updateProgressBar() {
  /*
    The duration check prevents the progress bar from receiving
    an invalid NaN value before the video metadata has loaded.

    MDN reference:
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
  */
  if (!video.duration) {
    return;
  }

  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}

/*
  Clicking the progress track allows the user to jump to
  another point in the video.

  MDN references:
  https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
*/
progressTrack.addEventListener("click", (event) => {
  if (!video.duration) {
    return;
  }

  const trackWidth = progressTrack.getBoundingClientRect().width;
  const clickPosition =
    event.clientX - progressTrack.getBoundingClientRect().left;

  const percentage = clickPosition / trackWidth;
  video.currentTime = percentage * video.duration;
});

/*
  The mute button changes the video's muted state and
  updates its label to provide clear feedback.
*/
muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;

  if (video.muted) {
    muteImg.src =
      "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png";
    muteImg.alt = "Audio muted";
    muteBtn.setAttribute("aria-label", "Unmute audio");
  } else {
    muteImg.src =
      "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
    muteImg.alt = "Audio on";
    muteBtn.setAttribute("aria-label", "Mute audio");
  }
});

/*
  Fullscreen is an additional feature suitable for a music video,
  because the video is intended to be the main visual experience.

  MDN reference:
  https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
*/
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
    fullscreenBtn.setAttribute("aria-label", "Exit fullscreen");
  } else {
    document.exitFullscreen();
    fullscreenBtn.setAttribute("aria-label", "Enter fullscreen");
  }
});

function hideVideoPlaceholder() {
  videoPlaceholder.hidden = true;
}

/*
  The navigation changes only the content inside the right information
  panel. The video and playback controls remain visible at all times.

  MDN references:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden
*/

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedSection = button.dataset.section;

    navButtons.forEach((navButton) => {
      navButton.classList.remove("active");
    });

    button.classList.add("active");

    infoViews.forEach((view) => {
      view.hidden = view.id !== selectedSection;
    });
  });
});

/*
  The slider updates the video's volume while the user moves it.
  The input event is suitable for range controls because it responds
  immediately to user interaction.

  MDN references:
  https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
*/

volumeSlider.addEventListener("input", () => {
  const selectedVolume = Number(volumeSlider.value);

  video.volume = selectedVolume;

  if (selectedVolume === 0) {
    video.muted = true;
  } else {
    video.muted = false;
    previousVolume = selectedVolume;
  }

  updateVolumeIcon();
});