class LegoMosaic {
  #imageWidth = 0;
  #imageHeight = 0;
  #imageResolution = 0;
  #imageRatio = 0;
  #mosaicWidth = 0;
  #mosaicHeight = 0;
  #mosaicResolution = 0;
  #mosaicRatio = 0;
  #imageData = null;
  #mosaicData = null;

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

  set imageMetadata(junk) {
    this.#imageResolution = this.#imageWidth * this.#imageHeight;
    this.#imageRatio = this.#imageWidth / this.#imageHeight;

    let factor = gcd(this.#imageWidth, this.#imageHeight);
    document.getElementById("imageResolution").innerHTML = this.#imageResolution
    document.getElementById("imageRatio").innerHTML = this.#imageRatio + " (" + (this.#imageWidth / factor) + ":" + (this.#imageHeight / factor) + ")";
  }

  set mosaicMetaData(junk) {
    this.#mosaicWidth = parseFloat(mosaicWidth.value);
    this.#mosaicHeight = parseFloat(mosaicHeight.value);
    this.#mosaicResolution = parseFloat(mosaicResolution.value);

    let factor = gcd(this.#mosaicWidth, this.#mosaicHeight);
    document.getElementById("mosaicWidth").innerHTML = this.#mosaicWidth;
    document.getElementById("mosaicHeight").innerHTML = this.#mosaicHeight;
    document.getElementById("mosaicResolution").innerHTML = this.#mosaicWidth * this.#mosaicHeight;
    document.getElementById("mosaicRatio").innerHTML = this.#mosaicWidth / this.#mosaicHeight + " (" + (this.#mosaicWidth / factor) + ":" + (this.#mosaicHeight / factor) + ")";
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
let mosaicWidth;
let mosaicHeight;

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
    lm.imageMetadata = null;
    let imageWidth = Math.floor(img.width / 16) * 16;
    let imageHeight = Math.floor(img.height / 16) * 16;
    mosaicWidth.min = 16;
    mosaicWidth.max = imageWidth;
    mosaicWidth.value = imageWidth;
    mosaicWidth.step = 16;
    mosaicHeight.min = 16;
    mosaicHeight.max = imageHeight;
    mosaicHeight.value = imageHeight;
    mosaicHeight.step = 16;
    drawCropper();
  }
}

function drawCropper() {
  console.log("drawCropper");
  console.log("lm1", lm);
  lm.mosaicMetaData = null;
  console.log("lm2", lm);

  imageImg.addEventListener('ready', resizeCropBox);

  if (cropper) {
    console.log("cropper destroy");
    cropper.destroy();
  }

  cropper = new Cropper(imageImg, {
    aspectRatio: lm.mosaicWidth / lm.mosaicHeight,
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

function resizeCropBox() {
  if (cropper.ready === true) {
    let contData = cropper.getContainerData();
    cropper.setCropBoxData({ width: lm.mosaicWidth / lm.imageWidth * contData.width, height: lm.mosaicHeight / lm.imageHeight * contData.height });
    cropper.getCroppedCanvas({
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
function gcd(a,b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function init() {
  imageImg = document.getElementById("image");
  mosaicWidth = document.getElementById("mosaicWidthRange");
  mosaicHeight = document.getElementById("mosaicHeightRange");
  mosaicResolution = document.getElementById("mosaicResolutionRange");

  document.getElementById("uploadimage").addEventListener("change", loadImage, false);
  mosaicWidth.addEventListener("change", drawCropper);
  mosaicHeight.addEventListener("change", drawCropper);

  lm = new LegoMosaic()

  // dem popovers for help!
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
}

window.onload = init;