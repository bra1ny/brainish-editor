documentReady = ->
  console.log "document ready"
  c = document.getElementById("panel-background")
  ctx = c.getContext("2d")
  ctx.moveTo(0,0)
  ctx.lineTo(200,100)
  ctx.stroke()

$(document).ready documentReady