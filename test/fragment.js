function canPlayVideos() {
  var elem = document.createElement('video'), bool = false;
  try {
    bool = !!elem.canPlayType;
  } catch (e) {}

  return bool;
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 60 * 1000;

describe("", function () {
  var sources = [
    { src: "http://techslides.com/demos/sample-videos/small.webm", type:"video/webm>" },
    { src: "http://techslides.com/demos/sample-videos/small.ogv", type:"video/ogg>" },
    { src: "http://techslides.com/demos/sample-videos/small.mp4", type:"video/mp4" },
    { src: "http://techslides.com/demos/sample-videos/small.3gp", type:"video/3gp" }
  ];

  it("sanity check", function (done) {
    expect(canPlayVideos()).toEqual(true);

    var video = document.createElement("video");

    sources.forEach(function (source) {
      var ele = document.createElement("source");
      ele.setAttribute("src", source.src);
      ele.setAttribute("type", source.type);

      video.appendChild(ele);
    });

    video.addEventListener("timeupdate", function (event) {
      expect(event.target.currentTime).toBeLessThan(3);
      video.pause();
      video.src = "";
      document.body.innerHTML = "";
      done();
    });

    document.body.appendChild(video);
    video.play();
    expect(video.currentTime).toBe(0);
  });

  it("jumps to media fragment automatically", function (done) {
    expect(canPlayVideos()).toEqual(true);

    var video = document.createElement("video");

    sources.forEach(function (source) {
      var ele = document.createElement("source");
      ele.setAttribute("src", source.src + "#t=4");
      ele.setAttribute("type", source.type);

      video.appendChild(ele);
    });

    video.addEventListener("timeupdate", function (event) {
      expect(event.target.currentTime).toBeGreaterThan(3.9);
      video.pause();
      video.src = "";
      document.body.innerHTML = "";
      done();
    });

    document.body.appendChild(video);
    video.play();
    expect(video.currentTime).toBe(0);
  });
});
