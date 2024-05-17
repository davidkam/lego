var imageImg = document.getElementById("image");
var accordion = document.getElementById("collapseOne");
//var imageCtx = imageCanvas.getContext("2d");

function draw(ev) {
    var img = new Image();
    var f = document.getElementById("uploadimage").files[0];
    var url = window.URL || window.webkitURL;
    var src = url.createObjectURL(f);
    console.log(src);

    img.src = src;
    img.onload = function() {
        imageImg.src = src;
        imageImg.width = accordion.clientWidth - 42;
        url.revokeObjectURL(src);
        document.getElementById("imageHeight").innerHTML = img.height;
        document.getElementById("imageWidth").innerHTML = img.width;
        document.getElementById("imageTotalPixels").innerHTML = img.width * img.height;
    }
}

document.getElementById("uploadimage").addEventListener("change", draw, false)
