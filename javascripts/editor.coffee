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
          "id": "print_2",
          "illusion": "PRINT",
          "input": {
            "content": "#for_each_1.iterator"
          }
        }
    }
  }
  {
    "id": "print_3",
    "illusion": "PRINT",
    "input": {
      "content": "meh"
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


colHeight = (col) ->
  $col = $("#janish-col-" + col)
  $last = $col.children().last()
  if $last.length
    $last.position().top + $last.height()
  else
    0



drawPadding = (col, height) ->
  if height - 7 - colHeight(col) > 0
    $padding = $("<div></div>")
    $padding.css("height", height - 7 - colHeight(col))
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
    # Get minimum padding requirement
    min = 0
    for i in [(col+1)...20]
      h = colHeight(i)
      if h > min
        min = h
    drawPadding(col, min)
    $janish = $(templateJanishItem(illusion))
#    $janish.attr("id", "janish-" + janish["id"])
    $("#janish-col-" + col).append($janish)
    if illusion.sub
      count = 0
      sub_list = []
      for key, output of illusion.sub
        sub_list.push({
          "name": key
          "output": output
        })
      sub_list.reverse()
      base_height = $janish.position().top
      console.log base_height
      for item in sub_list
        name = item["name"]
        output = item["output"]
        c = col + Object.keys(illusion.sub).length - count
        count++
        drawPadding(c, base_height)
        $("#janish-col-" + c).append(templateJanishSub(item))
        if janish["sub"] && janish["sub"][name]
          sub_janish = janish["sub"][name]
          drawJanish(sub_janish, c)
        $("#janish-col-" + c).append($janishPlus)


loadJanish = ->
  console.log(panel_janish)
  $janishPanel = $("#janish-panel")
  $janishPanel.html("")
  for i in [0...20]
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