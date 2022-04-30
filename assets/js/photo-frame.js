$(".access-cam-btn").on("click", function () {
    $("#camera-input").click();
});

$(".gallery-btn").on("click", function () {
    $("#gallery-input").click();
});

$(".image-uploader").on("change", function () {
    readURL(this);
});

$("#save").on("click", function () {
    canEdit = false
    createCanvas() ;
    submitPhoto();
});

const InlineWidth = 683.5 ;
const InlineHeight = 798.3 ;
const OutlineWidth = 764.5 ;
const OutlineHeight = 882.3 ;
const StartX = 40.5 ;
const StartY = 42

let canEdit, isDragging, prevX, prevY, userImage, maxX, maxY;
let currentStartX = 0 ;
let currentStartY = 0 ;
let move = true

$("#edit").on("click", function () {
    canEdit = true
});

$('#canvas').on('mousedown',function (e){
    isDragging = true
    prevX = e.clientX  ;
    prevY = e.clientY ;
})

$('#canvas').on('touchstart',function (e){
    isDragging = true
    prevX = e.touches[0].clientX  ;
    prevY = e.touches[0].clientY ;
})

$('#canvas').on('mouseup touchend',function (e){
    isDragging = false
    // canEdit = false
})

$('#canvas').mousemove(function (e){

    if (isDragging && canEdit)
    {
        handleMove(e.clientX,e.clientY)
    }
})

$('#zoom-range').on('change',function (){
    let zoomRatio =   $('#zoom-range').val() / 50
    maxX = userImage.width > InlineWidth / zoomRatio ? userImage.width - InlineWidth / zoomRatio : 0
    maxY = userImage.height >  InlineHeight / zoomRatio ? userImage.height -  InlineHeight / zoomRatio : 0
    reDrawCanvas() ;
})

$(window).on('touchmove',function (e){
    if (canEdit && isDragging )
    {
        handleMove(e.touches[0].clientX,e.touches[0].clientY)
    }
})

function handleMove(x,y)
{
    move = !move
    currentStartX -= move ?   (x - prevX) / 4 : 0;
    currentStartY -= move ? (y - prevY) / 4 : 0 ;
    reDrawCanvas()
}

function readURL(input) {
    if (input.files && input.files[0]) {
        $("#save").attr("disabled", false);
        $('.canvasimg').attr('src' ,$("#frame").attr('src') )
        let reader = new FileReader();
        reader.onload =  function (e) {
            let image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                userImage = image
                createFirstCanvas();
                createCanvas()
                $("#edit").attr("disabled", false).addClass('active-button');
                $("#zoom-range").attr("disabled", false).val(50);
            }
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#save").attr("disabled", true);
    }
}

function createFirstCanvas(){
    let canvas = $("#canvas")[0];
    let ctx = canvas.getContext("2d");
    let imageWidth = userImage.width ;
    let imageHeight = userImage.height ;
    // maxX = imageWidth > InlineWidth ?  imageWidth - InlineWidth : 0 ;
    // maxY = imageHeight > InlineHeight ? imageHeight -InlineHeight : 0;
    // if (userImage.width < InlineWidth)
    // {
    //         imageWidth = InlineWidth ;
    // }
    // if (userImage.height < InlineHeight)
    // {
    //     imageHeight = InlineHeight ;
    // }
    ctx.clearRect(0,0,OutlineWidth,OutlineHeight)
    ctx.drawImage(userImage, StartX, StartY,InlineWidth,InlineHeight);
}

function reDrawCanvas()
{
    fixCurrentStart()
    let zoomRatio =   $('#zoom-range').val() / 50
    let canvas = $("#canvas")[0];
    let ctx = canvas.getContext("2d");
    let widthTargeted =  InlineWidth / zoomRatio <= userImage.width ?   InlineWidth / zoomRatio : userImage.width
    let heightTargeted = InlineHeight / zoomRatio <= userImage.height ?  InlineHeight / zoomRatio : userImage.height
    ctx.clearRect(0,0,OutlineWidth,OutlineHeight)
    ctx.drawImage(userImage, StartX, StartX, 941, 1261);

    // ctx.drawImage(userImage, currentStartX, currentStartY,widthTargeted  ,heightTargeted  ,StartX,StartY,InlineWidth,InlineHeight);
}

function createCanvas() {
    let canvas = $("#canvas")[0];
    let frame = $("#frame")[0];
    let map = $("#map")[0];
    let ctx = canvas.getContext("2d");
    ctx.drawImage(frame, 0, 0, OutlineWidth, OutlineHeight);
    ctx.drawImage(map, 0, 0, OutlineWidth, OutlineHeight);
    $(".canvasimg").css("display", "none");
}

function submitPhoto()
{
    // loading();
    // let base64 = $("#canvas")[0].toDataURL();
    // download(base64);
    // $('.image-btn').attr('disabled', true)
    // unLoading();
}

function download(base64) {
    let link = document.createElement("a");
    link.download = "gsk.png";
    link.href = base64;
    link.click();
}

function fixCurrentStart()
{
    if (currentStartX > maxX)
        currentStartX = maxX

    if(currentStartY > maxY)
        currentStartY = maxY

    if (currentStartX < 0 )
        currentStartX = 0;

    if (currentStartY < 0 )
        currentStartY = 0;
}

function adjustRange(increase)
{
    if (canEdit)
    {
        let oldValue = $('#zoom-range').val()
        let newValue = increase ?  Number(oldValue)+1 : oldValue-1
        $('#zoom-range').val(newValue).change();
    }
}
