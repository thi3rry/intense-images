var IntenseCustom, applyProperties;

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

window.cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
})();

applyProperties = function(target, properties) {
  var key;
  for (key in properties) {
    target.style[key] = properties[key];
  }
};

IntenseCustom = (function() {
  IntenseCustom.prototype.KEYCODE_ESC = 27;

  IntenseCustom.prototype.mouse = {
    xCurr: 0,
    yCurr: 0,
    xDest: 0,
    yDest: 0
  };

  IntenseCustom.prototype.horizontalOrientation = true;

  IntenseCustom.prototype.looper = void 0;

  IntenseCustom.prototype.lastPosition = void 0;

  IntenseCustom.prototype.currentPosition = 0;

  IntenseCustom.prototype.sourceDimensions = void 0;

  IntenseCustom.prototype.target = void 0;

  IntenseCustom.prototype.targetDimensions = {
    w: 0,
    h: 0
  };

  IntenseCustom.prototype.container = void 0;

  IntenseCustom.prototype.containerDimensions = {
    w: 0,
    h: 0
  };

  IntenseCustom.prototype.overflowArea = {
    x: 0,
    y: 0
  };

  IntenseCustom.prototype.overflowValue = void 0;

  function IntenseCustom(element, initOnClick) {
    if (initOnClick == null) {
      initOnClick = false;
    }
    if (!element) {
      throw "You need to pass an element!";
    }
    if (initOnClick) {
      this.startTracking(element);
    }
    return this;
  }

  IntenseCustom.prototype.getFit = function(source) {
    var heightRatio, widthRatio;
    heightRatio = window.innerHeight / source.h;
    if ((source.w * heightRatio) > window.innerWidth) {
      return {
        w: source.w * heightRatio,
        h: source.h * heightRatio,
        fit: true
      };
    } else {
      widthRatio = window.innerWidth / source.w;
      return {
        w: source.w * widthRatio,
        h: source.h * widthRatio,
        fit: false
      };
    }
  };

  IntenseCustom.prototype.startTracking = function(passedElements) {
    var i;
    i = void 0;
    if (passedElements.length) {
      i = 0;
      while (i < passedElements.length) {
        this.track(passedElements[i]);
        i++;
      }
    } else {
      this.track(passedElements);
    }
  };

  IntenseCustom.prototype.track = function(element) {
    if (element.getAttribute("data-image") || element.src) {
      element.addEventListener("click", (function() {
        this.init(this);
      }), false);
    }
  };

  IntenseCustom.prototype.start = function() {
    this._loop();
  };

  IntenseCustom.prototype.stop = function() {
    if (this.looper) {
      cancelRequestAnimFrame(this.looper);
    }
  };

  IntenseCustom.prototype._loop = function() {
    this.looper = requestAnimFrame(this._loop.bind(this));
    this.positionTarget();
  };

  IntenseCustom.prototype.lockBody = function() {
    this.overflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  IntenseCustom.prototype.unlockBody = function() {
    document.body.style.overflow = this.overflowValue;
  };

  IntenseCustom.prototype.createViewer = function(title, caption) {
    var captionContainer, captionContainerProperties, captionText, captionTextProperties, captionTitle, captionTitleProperties, containerProperties, imageProperties;
    containerProperties = {
      backgroundColor: "rgba(0,0,0,0.8)",
      width: "100%",
      height: "100%",
      position: "fixed",
      top: "0px",
      left: "0px",
      overflow: "hidden",
      zIndex: "999999",
      margin: "0px",
      webkitTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      MozTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      transition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      opacity: "0"
    };
    this.container = document.createElement("figure");
    this.container.className = 'intense-figure';
    this.container.appendChild(this.target);
    applyProperties(this.container, containerProperties);
    imageProperties = {
      cursor: "url( \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0IyNDI3M0FFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0IyNDI3NEFFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQjI0MjcxQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDQjI0MjcyQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+soZ1WgAABp5JREFUeNrcWn9M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\" ) 25 25, auto"
    };
    applyProperties(this.target, imageProperties);
    captionContainerProperties = {
      fontFamily: "Georgia, Times, \"Times New Roman\", serif",
      position: "fixed",
      bottom: "0px",
      left: "0px",
      padding: "20px",
      color: "#fff",
      wordSpacing: "0.2px",
      webkitFontSmoothing: "antialiased",
      textShadow: "-1px 0px 1px rgba(0,0,0,0.4)"
    };
    captionContainer = document.createElement("figcaption");
    applyProperties(captionContainer, captionContainerProperties);
    if (title) {
      captionTitleProperties = {
        margin: "0px",
        padding: "0px",
        fontWeight: "normal",
        fontSize: "40px",
        letterSpacing: "0.5px",
        lineHeight: "35px",
        textAlign: "left"
      };
      captionTitle = document.createElement("h1");
      applyProperties(captionTitle, captionTitleProperties);
      captionTitle.innerHTML = title;
      captionContainer.appendChild(captionTitle);
    }
    if (caption) {
      captionTextProperties = {
        margin: "0px",
        padding: "0px",
        fontWeight: "normal",
        fontSize: "20px",
        letterSpacing: "0.1px",
        maxWidth: "500px",
        textAlign: "left",
        background: "none",
        marginTop: "5px"
      };
      captionText = document.createElement("h2");
      applyProperties(captionText, captionTextProperties);
      captionText.innerHTML = caption;
      captionContainer.appendChild(captionText);
    }
    this.container.appendChild(captionContainer);
    this.setDimensions();
    this.mouse.xCurr = this.mouse.xDest = window.innerWidth / 2;
    this.mouse.yCurr = this.mouse.yDest = window.innerHeight / 2;
    document.body.appendChild(this.container);
    setTimeout((function() {
      this.container.style["opacity"] = "1";
    }).bind(this), 10);
  };

  IntenseCustom.prototype.removeViewer = function() {
    var err;
    this.unlockBody();
    this.unbindEvents();
    try {
      document.body.removeChild(this.container);
    } catch (_error) {
      err = _error;
      console.log(err);
    }
  };

  IntenseCustom.prototype.setDimensions = function() {
    var imageDimensions;
    imageDimensions = this.getFit(this.sourceDimensions);
    this.target.width = imageDimensions.w;
    this.target.height = imageDimensions.h;
    this.horizontalOrientation = imageDimensions.fit;
    this.targetDimensions = {
      w: this.target.width,
      h: this.target.height
    };
    this.containerDimensions = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    this.overflowArea = {
      x: this.containerDimensions.w - this.targetDimensions.w,
      y: this.containerDimensions.h - this.targetDimensions.h
    };
  };

  IntenseCustom.prototype.init = function(element) {
    var caption, elemClasses, imageSource, img, self, title;
    imageSource = element.getAttribute("data-image") || element.src;
    title = element.getAttribute("data-title");
    caption = element.getAttribute("data-caption");
    elemClasses = element.className.split(" ");
    elemClasses.push("intense-loading");
    element.className = elemClasses.join(" ");
    img = new Image();
    self = this;
    img.onload = function() {
      self.sourceDimensions = {
        w: img.width,
        h: img.height
      };
      self.target = this;
      self.createViewer(title, caption);
      self.lockBody();
      self.bindEvents();
      self._loop();
      element.className = element.className.replace("intense-loading", "");
    };
    img.src = imageSource;
  };

  IntenseCustom.prototype.bindEvents = function() {
    var _ref, _ref1;
    if ((_ref = this.container) != null) {
      if (typeof _ref.addEventListener === "function") {
        _ref.addEventListener("mousemove", this.onMouseMove.bind(this), false);
      }
    }
    if ((_ref1 = this.container) != null) {
      if (typeof _ref1.addEventListener === "function") {
        _ref1.addEventListener("touchmove", this.onTouchMove.bind(this), false);
      }
    }
    window.addEventListener("resize", this.setDimensions.bind(this), false);
    window.addEventListener("keyup", this.onKeyUp.bind(this), false);
    this.target.addEventListener("click", this.removeViewer.bind(this), false);
  };

  IntenseCustom.prototype.unbindEvents = function() {
    var _ref, _ref1;
    if ((_ref = this.container) != null) {
      if (typeof _ref.removeEventListener === "function") {
        _ref.removeEventListener("mousemove", this.onMouseMove.bind(this), false);
      }
    }
    if ((_ref1 = this.container) != null) {
      if (typeof _ref1.removeEventListener === "function") {
        _ref1.removeEventListener("touchmove", this.onTouchMove.bind(this), false);
      }
    }
    window.removeEventListener("resize", this.setDimensions.bind(this), false);
    window.removeEventListener("keyup", this.onKeyUp.bind(this), false);
    this.target.removeEventListener("click", this.removeViewer.bind(this), false);
  };

  IntenseCustom.prototype.onMouseMove = function(event) {
    this.mouse.xDest = event.clientX;
    this.mouse.yDest = event.clientY;
  };

  IntenseCustom.prototype.onTouchMove = function(event) {
    this.mouse.xDest = event.touches[0].clientX;
    this.mouse.yDest = event.touches[0].clientY;
  };

  IntenseCustom.prototype.onKeyUp = function(event) {
    event.preventDefault();
    if (event.keyCode === this.KEYCODE_ESC) {
      this.removeViewer();
    }
  };

  IntenseCustom.prototype.positionTarget = function() {
    var position;
    this.mouse.xCurr += (this.mouse.xDest - this.mouse.xCurr) * 0.05;
    this.mouse.yCurr += (this.mouse.yDest - this.mouse.yCurr) * 0.05;
    if (this.horizontalOrientation === true) {
      this.currentPosition += this.mouse.xCurr - this.currentPosition;
      if (this.mouse.xCurr !== this.lastPosition) {
        position = parseFloat(this.currentPosition / this.containerDimensions.w);
        position = this.overflowArea.x * position;
        this.target.style["webkitTransform"] = "translate3d(" + position + "px, 0px, 0px)";
        this.target.style["MozTransform"] = "translate3d(" + position + "px, 0px, 0px)";
        this.target.style["msTransform"] = "translate3d(" + position + "px, 0px, 0px)";
        this.lastPosition = this.mouse.xCurr;
      }
    } else if (this.horizontalOrientation === false) {
      this.currentPosition += this.mouse.yCurr - this.currentPosition;
      if (this.mouse.yCurr !== this.lastPosition) {
        position = parseFloat(this.currentPosition / this.containerDimensions.h);
        position = this.overflowArea.y * position;
        this.target.style["webkitTransform"] = "translate3d( 0px, " + position + "px, 0px)";
        this.target.style["MozTransform"] = "translate3d( 0px, " + position + "px, 0px)";
        this.target.style["msTransform"] = "translate3d( 0px, " + position + "px, 0px)";
        this.lastPosition = this.mouse.yCurr;
      }
    }
  };

  return IntenseCustom;

})();
