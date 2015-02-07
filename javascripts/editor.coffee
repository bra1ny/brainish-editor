illusions = null
currentIllusionList = 0

currentDraggingType = 0
currentDraggingData = null

DRAGGING_ILLUSION_FROM_LIST = 1
DRAGGING_ILLUSION_FROM_PANEL = 2
DRAGGING_OUTPUT_FROM_PANEL = 3


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
      onClick
    $item.click setChangeCurrentIllusionList()
    $illusionType.append($item)

  templateIllusionItem = _template($("#template-illusion-item").html())
  $illusionList = $("#illusion-list")
  $illusionList.html("")
  for str_i, ill of illusions[currentIllusionList]["list"]
    $item = $(templateIllusionItem(ill))
    createDragStart = ->
      currentIll = ill
      dragStart = ->
        currentDraggingType = DRAGGING_ILLUSION_FROM_LIST
        currentDraggingData = currentIll
      dragStart

    $item.on("dragstart", createDragStart())
    $illusionList.append($item)


setupDropEvent = ->
  $(".illusion-plus").on("dragover", (e) ->
    e.preventDefault()
  )
  $(".illusion-plus").on("drop",(e) ->
    console.log currentDraggingType
    console.log currentDraggingData
  )

documentReady = ->
  $.ajax
    "url": "illusions.json"
    "dataType": "json"
    "success": (data) ->
      illusions = data
      loadIllusions()
  setupDropEvent()


$(document).ready documentReady