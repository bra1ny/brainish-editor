illusions = null
illusionDict = {}
currentIllusionList = 0

currentDraggingType = 0
currentDraggingData = null

DRAGGING_ILLUSION_FROM_LIST = 1
DRAGGING_ILLUSION_FROM_PANEL = 2
DRAGGING_OUTPUT_FROM_PANEL = 3

panel_janish = [
  {
    "id": "list_file_1",
    "illusion": "LS",
    "input": {
      "path": "."
    }
  }
  {
    "id": "for_each_1",
    "illusion": "FOR",
    "input": {
      "list": "#list_file_1.file_list"
    },
    "sub": {
      "body":
        {
          "id": "print_1",
          "illusion": "PRINT",
          "input": {
            "content": "#for_each_1.iterator"
          }
        }
    }
  }
]


logLocation = ->
  $illusion1 = $("#illusion-2")
  console.log $("#illusion-1").position()
  console.log $("#illusion-2").position()
  console.log $("#illusion-3").position()


loadIllusions = ->
  for illusionType in illusions
    for illusion in illusionType["list"]
      illusionDict[illusion["illusion"]] = illusion
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
    $(this).addClass "drag-over"
  )
  $(".illusion-plus").on("dragleave", (e) ->
    e.preventDefault()
    $(this).removeClass "drag-over"
  )
  $(".illusion-plus").on("drop",(e) ->
    console.log currentDraggingType
    console.log currentDraggingData
  )


colHeight = []

drawPadding = (col, height) ->
  $padding = $("<div></div>")
  $padding.css("height", height-7)
  $("#janish-col-" + col).append($padding)


templateJanishItem = _template($("#template-janish-item").html())
templateJanishSub = _template($("#template-janish-sub").html())
$janishPlus = $("#template-janish-plus").html()
drawJanish = (janish, col) ->
  if Array.isArray(janish)
    for j in janish
      drawJanish(j, col)
#    $("#janish-col-" + col).append($janishPlus)
  else
    illusion = illusionDict[janish["illusion"]]
    console.log(illusion)
    $janish = $(templateJanishItem(illusion))
#    $janish.attr("id", "janish-" + janish["id"])
    $("#janish-col-" + col).append($janish)
    if illusion.sub
      height = $janish.position().top
      for key, output of illusion.sub
        col++
        drawPadding(col, height)
        $("#janish-col-" + col).append(templateJanishSub({
          "name": key,
          "output": output
        }))
        if janish["sub"] && janish["sub"][key]
          sub_janish = janish["sub"][key]
          drawJanish(sub_janish, col)
        $("#janish-col-" + col).append($janishPlus)
  col


loadJanish = ->
  console.log(panel_janish)
  colHeight = []
  $janishPanel = $("#janish-panel")
  $janishPanel.html("")
  for i in [0...20]
    colHeight.push(0)
    $item = $('<div class="janish-col"></div>')
    $item.attr("id", "janish-col-" + i)
    $janishPanel.append($item)
  drawJanish(panel_janish, 0)
  $("#janish-col-0").append($janishPlus)


documentReady = ->
  $.ajax
    "url": "illusions.json"
    "dataType": "json"
    "success": (data) ->
      illusions = data
      loadIllusions()
      loadJanish()
  setupDropEvent()


$(document).ready documentReady