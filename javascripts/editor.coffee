illusions = null
currentIllusionList = 0


logLocation = ->
  $illusion1 = $("#illusion-2")
  console.log $("#illusion-1").position()
  console.log $("#illusion-2").position()
  console.log $("#illusion-3").position()



loadIllusions = ->
  templateIllusionTypeItem = _template($("#template-illusion-type-item").html())
  $illusionType = $("#illusion-type")
  $illusionType.html("")
  for str_i, ill of illusions
    i = parseInt(str_i)
    if currentIllusionList == i
      ill["current"] = true
    else
      ill["current"] = false
    $item = $(templateIllusionTypeItem(ill))
    setChangeCurrentIllusionList = ->
      newListId = i
      onClick = ->
        currentIllusionList = newListId
        loadIllusions()
      return onClick
    $item.click setChangeCurrentIllusionList()
    $illusionType.append($item)

  templateIllusionItem = _template($("#template-illusion-item").html())
  $illusionList = $("#illusion-list")
  $illusionList.html("")
  for str_id, ill of illusions[currentIllusionList]["list"]
    $item = $(templateIllusionItem(ill))
    $illusionList.append($item)


documentReady = ->
#  console.log "document ready"
#  $("#illusion-panel").click(logLocation)
#  logLocation()
#  $(".illusion-plus").on("dragover", (e) ->
#    e.preventDefault()
#  )
#  $(".illusion-plus").on("drop",(e) ->
#    console.log "drop"
#  )
#  $(".illusion-option").on("dragstart", (e) ->
#    console.log this
#  )
  $.ajax
    "url": "illusions.json"
    "dataType": "json"
    "success": (data) ->
      illusions = data
      loadIllusions()


$(document).ready documentReady