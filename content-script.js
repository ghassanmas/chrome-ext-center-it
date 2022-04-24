var status1 = status1 || false;
var prevMargin;
var prevWidth
if (!status1) {
    //first time
    prevMargin = document.body.style.margin;
    prevWidth = document.body.style.width;
    status1 = true;
    document.body.style.margin = "auto";
    document.body.style.width = "800px"
    console.log("here should hanfe", status)
} else {
    console.log(typeof status);
    console.log("three", status)

    document.body.style.margin = prevWidth;
    document.body.style.width = prevMargin;
    status1 = false;
}

console.log("helllo");
console.log("this is ,", this);