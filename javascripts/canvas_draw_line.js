function drawLine(p1_x, p1_y, p2_x, p2_y) {
    // FILL IN CANVAS ID
    var c = document.getElementById("");
    // 2d line
    var ctx = c.getContext("2d");
    // starting point
    ctx.moveTo(p1_x, p1_y);
    // ending point
    ctx.lineTo(p2_x, p2_y);
    // line up
    ctx.stroke();
}