//--- Original video scroll code
// https://codepen.io/shshaw/pen/vYKBPbv/9e810322d70c306de2d18237d0cb2d78
// https://codepen.io/AdventurousDeveloper/pen/XWZxLyO

/* The encoding is super important here to enable frame-by-frame scrubbing. */

// ffmpeg -i input.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output.mp4
// ffmpeg -i input.mov -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output_960.mp4


gsap.registerPlugin(ScrollTrigger)

let videoScroll = document.querySelector(".video-scroll"),
    frameNumber = 0,
    src = videoScroll.currentSrc || videoScroll.src


videoScrollTL = gsap.timeline({
  defaults: { duration: 1 },
  scrollTrigger: {
    trigger: ".video-container",
    pin: true,
    start: "top top",
    end: "+=100%",
    scrub: true,
    markers: false,                               // shows start and end of scrolling if true
    onUpdate: self => {
      frameNumber = self.progress / 14 * 100 - 1; //this takes fine tuning divide your videos FPS by two. My video's FPS was 30, 14 was the sweet spot. -1 fixes an issue on safari where the video disappears at the end of the scrollTrigger
      videoScroll.currentTime = frameNumber;
    }
  }
});		    

/* Make sure the video is 'activated' on iOS */
function once(el, event, fn, opts) {
  var onceFn = function (e) {
    el.removeEventListener(event, onceFn);
    fn.apply(this, arguments);
  };
  el.addEventListener(event, onceFn, opts);
  return onceFn;
}			    

once(document.documentElement, "touchstart", function (e) {
  videoScroll.play();
  videoScroll.pause();
});

//make sure video has loaded
once(videoScroll, "loadedmetadata", function () {
  videoScrollTL.fromTo(videoScroll, { currentTime: 0 }, { currentTime: videoScroll.duration - 0.10 });
});

//When first coded, the Blobbing was important to ensure the browser wasn't dropping previously played segments, but it doesn't seem to be a problem now. Possibly based on memory availability?
setTimeout(function () {
  if (window["fetch"]) {
    fetch(src).then(function (response) {
      return response.blob();
    }).then(function (response) {
      var blobURL = URL.createObjectURL(response);
      var t = videoScroll.currentTime;
      once(document.documentElement, "touchstart", function (e) {
        videoScroll.setAttribute("src", blobURL);
        videoScroll.currentTime = t + 0.01;
      });
    });
  }
}, 0);

// Change video source
document.getElementById("bojji").addEventListener("click", vidsource_Bojji);
function vidsource_Bojji() {
  document.getElementById("video").setAttribute('src', 'static/bojji_final.mp4');
};

document.getElementById("corgi").addEventListener("click", vidsource_Corgi);
function vidsource_Corgi() {
  document.getElementById("video").setAttribute('src', 'static/corgi_final.mp4');
};

// Display uploaded video as source
document.getElementById("upload-video-file").addEventListener("change", function() {
  const video_file = this.files[0];
  const media = URL.createObjectURL(video_file);
  var video = document.getElementById("video");
  video.src = media;
});
