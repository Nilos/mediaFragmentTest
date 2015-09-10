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

  var listeners = [];
  function listen(element, type, cb) {
    element.addEventListener(type, cb);
    listeners.push({
      type: type,
      element: element,
      cb: cb
    });
  }

  var video;

  beforeEach(function () {
    video = document.createElement("video");
  });

  afterEach(function () {
    video.pause();
    video.src = "";
    listeners.forEach(function (listener) {
      listener.element.removeEventListener(listener.type, listener.cb);
    });
    document.body.innerHTML = "";
  });

  function loadSources(fragment) {
    sources.forEach(function (source) {
      var ele = document.createElement("source");
      ele.setAttribute("src", source.src + fragment);
      ele.setAttribute("type", source.type);

      video.appendChild(ele);
    });
  }

  it("sanity check", function (done) {
    expect(canPlayVideos()).toEqual(true);

    loadSources("");

    listen(video, "timeupdate", function (event) {
      expect(event.target.currentTime).toBeLessThan(3);
      done();
    });

    document.body.appendChild(video);
    video.play();
    expect(video.currentTime).toBe(0);
  });

  it("jumps to media fragment automatically", function (done) {
    expect(canPlayVideos()).toEqual(true);

    loadSources("#t=4");

    listen(video, "timeupdate", function (event) {
      expect(video.currentTime).toBeGreaterThan(3.9);
      done();
    });

    document.body.appendChild(video);
    video.play();
    expect(video.currentTime).toBe(0);
  });

  it("can jump before fragments", function (done) {
    expect(canPlayVideos()).toEqual(true);

    loadSources("#t=4");

    var firstUpdate = true;

    listen(video, "timeupdate", function (event) {
      if (firstUpdate) {
        video.currentTime = 1;
        firstUpdate = false;
      } else {
        expect(video.currentTime).toBeGreaterThan(0.9);
        expect(video.currentTime).toBeLessThan(1.5);
        done();
      }
    });

    document.body.appendChild(video);
    video.play();
    expect(video.currentTime).toBe(0);
  });

});
