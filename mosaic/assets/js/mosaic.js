class LegoMosaic {
  #imageWidth = 0;
  #imageHeight = 0;
  #imageResolution = 0;
  #imageRatio = 0;
  #mosaicWidth = 0;
  #mosaicHeight = 0;
  #mosaicResolution = 0;
  #mosaicRatio = 0;
  #mosaicCost = 0;
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
    console.log("here");
    mosaicRatio.value = (this.#mosaicWidth / factor) + ":" + (this.#mosaicHeight / factor);
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
let uploadImage;
let mosaicRatio;
let mosaicWidth;
let mosaicHeight;

function loadImage(e) {
  let img = new Image();
  let f = uploadImage.files[0];
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
    mosaicRatio.disabled = false;
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

function updateRatio() {
  let regex =  /^(\d+):(\d+)$/
  let m = mosaicRatio.value.match(regex);
  // make sure entered in value is in the format <number>:<number>
  if(m === null) {
    lm.mosaicMetaData = null;
    return;
  }
  let newWidth = parseInt(m[1]);
  let newHeight = parseInt(m[2]);
  // make sure both are non-zero
  if (!newWidth || ! newHeight) {
    lm.mosaicMetaData = null;
    return;
  }
  let factor = Math.min(Math.floor(lm.imageWidth / 16 / newWidth), (lm.imageHeight / 16 / newHeight));
  mosaicWidth.value = factor * 16 * newWidth;
  mosaicHeight.value = factor * 16 * newHeight;
  drawCropper();
}

function gcd(a,b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function init() {
  imageImg = document.getElementById("image");
  uploadImage = document.getElementById("uploadImage")
  mosaicRatio = document.getElementById("mosaicRatio");
  mosaicWidth = document.getElementById("mosaicWidthRange");
  mosaicHeight = document.getElementById("mosaicHeightRange");
  mosaicResolution = document.getElementById("mosaicResolutionRange");

  uploadImage.value = '';
  mosaicRatio.value = '';
  mosaicRatio.disabled = true;

  uploadImage.addEventListener("change", loadImage, false);
  mosaicWidth.addEventListener("change", drawCropper);
  mosaicHeight.addEventListener("change", drawCropper);
  mosaicRatio.addEventListener("blur", updateRatio);

  lm = new LegoMosaic()
  console.log("lm",lm)

  // dem popovers for help!
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
}

window.onload = init;