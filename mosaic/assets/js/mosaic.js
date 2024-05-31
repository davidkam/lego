class LegoMosaic {
  #imageWidth = 0;
  #imageHeight = 0;
  #imageResolution = 0;
  #mosaicWidth = 0;
  #mosaicHeight = 0;
  #mosaicResolution = 0;
  #image = null;
  #mosaic = null;

  constructor() {
  }

  set imageWidth(width) {
    document.getElementById("imageWidth").innerHTML = width;
    this.#imageWidth = width;
  }

  set imageHeight(height) {
    document.getElementById("imageHeight").innerHTML = height;
    this.#imageHeight = height;
  }

  get imageWidth() {
    return this.#imageWidth;
  }

  get imageHeight() {
    return this.#imageHeight;
  }

  get imageResolution() {
    document.getElementById("imageResolution").innerHTML = this.#imageWidth * this.#imageHeight;
    this.#imageResolution = this.#imageWidth * this.#imageHeight;
    return this.#imageResolution;
  }

  set mosaicWidth(junk) {
    this.#mosaicWidth = parseFloat(document.getElementById("mosaicWidth").value);
  }

  set mosaicHeight(junk) {
    this.#mosaicHeight = parseFloat(document.getElementById("mosaicHeight").value);
  }

  set mosaicResolution(junk) {
    this.#mosaicResolution = parseFloat(document.getElementById("mosaicResolution").value);
  }

  get imageWidth() {
    return this.#imageWidth;
  }

  get imageHeight() {
    return this.#imageHeight;
  }

  get mosaicWidth() {
    return this.#mosaicWidth;
  }

  get mosaicHeight() {
    return this.#mosaicHeight;
  }

  get mosaicResolution() {
    return this.#mosaicResolution;
  }
}

let lm;
let cropper;
let imageImg;

function loadImage(e) {
  let img = new Image();
  let f = document.getElementById("uploadimage").files[0];
  let url = window.URL || window.webkitURL;
  let src = url.createObjectURL(f);

  img.src = src;
  img.onload = function () {
    imageImg.width = document.getElementById("imageSelect").clientWidth;
    imageImg.src = src;
    url.revokeObjectURL(src);
    lm.imageWidth = img.width;
    lm.imageHeight = img.height;
    let junk = lm.imageResolution;
    drawCropper();
  }
}

function drawCropper() {
  console.log("drawCropper");
  if (typeof cropper !== 'undefined') {
    console.log("cropper destroy");
    cropper.destroy();
    cropper = null;
    imageImg.removeEventListener("ready", resizeCropBox);
  }
  lm.mosaicWidth = null;
  lm.mosaicHeight = null;
  lm.mosaicResolution = null;

  mosaicWidth = document.getElementById("mosaicWidth");
  mosaicWidth.step = 100 / (lm.imageWidth / 16);

  mosaicHeight = document.getElementById("mosaicHeight");
  mosaicHeight.step = 100 / (lm.imageHeight / 16);
  
  imageImg.addEventListener('ready', resizeCropBox);

  function resizeCropBox() {
    if (this.cropper.ready === true) {
      let contData = this.cropper.getContainerData();
      console.log("cropper", this.cropper);
      this.cropper.setCropBoxData({ width: lm.mosaicWidth / 100 * contData.width, height: lm.mosaicHeight / 100 * contData.height });
      this.cropper.getCroppedCanvas({
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        console.log(blob);
      });
    } else {
      return
    }
  }

  cropper = new Cropper(imageImg, {
    aspectRatio: (lm.mosaicWidth / 100 * lm.imageWidth) / (lm.mosaicHeight / 100 * lm.imageHeight),
    cropBoxResizable: false,
    zoomOnWheel: false,
    zoomOnTouch: false,
    autoCropArea: 0,
    crop(event) {
      //console.log(event.detail.width);
      //console.log(event.detail.height);
    },
  });
}

function init() {
  document.getElementById("uploadimage").addEventListener("change", loadImage, false);
  document.getElementById("mosaicWidth").addEventListener("change", drawCropper);
  document.getElementById("mosaicHeight").addEventListener("change", drawCropper);

  imageImg = document.getElementById("image");
  lm = new LegoMosaic()
}

window.onload = init;