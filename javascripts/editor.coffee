logLocation = ->
  $illusion1 = $("#illusion-2")
  console.log $("#illusion-1").position()
  console.log $("#illusion-2").position()
  console.log $("#illusion-3").position()


documentReady = ->
  console.log "document ready"
  $("#illusion-panel").click(logLocation)
  logLocation()
  $(".illusion-plus").on("dragover", (e) ->
    e.preventDefault()
  )
  $(".illusion-plus").on("drop",(e) ->
    console.log "drop"
  )
  $(".illusion-option").on("dragstart", (e) ->
    console.log this
  )

$(document).ready documentReady