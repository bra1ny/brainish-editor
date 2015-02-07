// Generated by CoffeeScript 1.8.0
(function() {
  var DRAGGING_ILLUSION_FROM_LIST, DRAGGING_ILLUSION_FROM_PANEL, DRAGGING_OUTPUT_FROM_PANEL, clearContext, colHeight, createJanish, createPlus, currentDraggingData, currentDraggingType, currentIllusionList, documentReady, drawJanish, drawLine, drawPadding, illusionDict, illusions, janishPlusHtml, loadIllusions, loadJanish, logLocation, monitorShowed, panel_janish, setInput, setupDropEvent, templateJanishItem, templateJanishSub;

  illusions = null;

  illusionDict = {};

  currentIllusionList = 0;

  currentDraggingType = 0;

  currentDraggingData = null;

  DRAGGING_ILLUSION_FROM_LIST = 1;

  DRAGGING_ILLUSION_FROM_PANEL = 2;

  DRAGGING_OUTPUT_FROM_PANEL = 3;

  panel_janish = [
    {
      "id": "list_file_1",
      "illusion": "LS",
      "input": {
        "path": "."
      }
    }, {
      "id": "print_3",
      "illusion": "PRINT",
      "input": {
        "content": "meh"
      }
    }, {
      "id": "for_each_1",
      "illusion": "FOR",
      "input": {
        "list": "#list_file_1.file_list"
      },
      "sub": {
        "body": [
          {
            "id": "print_2",
            "illusion": "PRINT",
            "input": {
              "content": "#for_each_1.iterator"
            }
          }, {
            "id": "for_each_2",
            "illusion": "FOR",
            "input": {
              "list": "#list_file_1.file_list"
            }
          }
        ]
      }
    }
  ];

  setInput = function(value, path, variable) {
    var i, j, json_path, p, p_id, p_sub, paths, working, _i, _len;
    path = path.substring(5);
    paths = path.split(".");
    working = panel_janish;
    json_path = "";
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      p = paths[_i];
      if (p.indexOf("|") >= 0) {
        p_id = p.split("|")[0];
        p_sub = p.split("|")[1];
        if (Array.isArray(working)) {
          for (i in working) {
            j = working[i];
            if (j["id"] === p_id) {
              json_path += "[" + i + "]";
              working = j["sub"][p_sub];
              json_path += ".sub[\"" + p_sub + "\"]";
              break;
            }
          }
        } else {
          working = working["sub"][p_sub];
        }
      } else {
        for (i in working) {
          j = working[i];
          if (j["id"] === p) {
            json_path += "[" + i + "]";
            working = j;
            break;
          }
        }
      }
    }
    working["input"][variable] = value;
    console.log(working);
    console.log(panel_janish);
    return loadJanish();
  };

  createJanish = function(path, illusion) {
    var ex, i, j, janish, json_path, p, p_id, p_sub, paths, working, _i, _len;
    path = path.substring(5);
    paths = path.split(".");
    working = panel_janish;
    json_path = "";
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      p = paths[_i];
      if (p.indexOf("|") >= 0) {
        p_id = p.split("|")[0];
        p_sub = p.split("|")[1];
        if (Array.isArray(working)) {
          for (i in working) {
            j = working[i];
            if (j["id"] === p_id) {
              json_path += "[" + i + "]";
              if (!j["sub"]) {
                j["sub"] = {};
              }
              if (!j["sub"][p_sub]) {
                j["sub"][p_sub] = [];
              }
              working = j["sub"][p_sub];
              json_path += ".sub[\"" + p_sub + "\"]";
              break;
            }
          }
        } else {
          working = working["sub"][p_sub];
        }
      } else {
        for (i in working) {
          j = working[i];
          if (j["id"] === p) {
            json_path += "[" + i + "]";
            working = j;
            break;
          }
        }
      }
    }
    janish = {
      "id": "test",
      "illusion": illusion["illusion"],
      "input": {},
      "output": {}
    };
    try {
      eval("panel_janish" + json_path + ".push(janish)");
    } catch (_error) {
      ex = _error;
      val("panel_janish" + json_path + " = [janish]");
    }
    return loadJanish();
  };

  logLocation = function() {
    var $illusion1;
    $illusion1 = $("#illusion-2");
    console.log($("#illusion-1").position());
    console.log($("#illusion-2").position());
    return console.log($("#illusion-3").position());
  };

  drawLine = function(p1_x, p1_y, p2_x, p2_y) {
    var c, context;
    c = document.getElementById('panel-background');
    context = c.getContext('2d');
    context.beginPath();
    context.moveTo(p1_x, p1_y);
    context.lineTo(p2_x, p2_y);
    context.strokeStyle = '#A4A4A4';
    context.lineWidth = 4;
    return context.stroke();
  };

  clearContext = function() {
    var c, context;
    c = document.getElementById('panel-background');
    context = c.getContext('2d');
    return context.clearRect(0, 0, c.width, c.height);
  };

  loadIllusions = function() {
    var $illusionList, $illusionType, $item, createDragStart, i, ill, illusion, illusionType, setChangeCurrentIllusionList, str_i, templateIllusionItem, templateIllusionTypeItem, _i, _j, _len, _len1, _ref, _ref1, _results;
    for (_i = 0, _len = illusions.length; _i < _len; _i++) {
      illusionType = illusions[_i];
      _ref = illusionType["list"];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        illusion = _ref[_j];
        illusionDict[illusion["illusion"]] = illusion;
      }
    }
    templateIllusionTypeItem = _template($("#template-illusion-type-item").html());
    $illusionType = $("#illusion-type");
    $illusionType.html("");
    for (str_i in illusions) {
      ill = illusions[str_i];
      i = parseInt(str_i);
      if (currentIllusionList === i) {
        ill["current"] = true;
      } else {
        ill["current"] = false;
      }
      $item = $(templateIllusionTypeItem(ill));
      setChangeCurrentIllusionList = function() {
        var newListId, onClick;
        newListId = i;
        onClick = function() {
          currentIllusionList = newListId;
          return loadIllusions();
        };
        return onClick;
      };
      $item.click(setChangeCurrentIllusionList());
      $illusionType.append($item);
    }
    templateIllusionItem = _template($("#template-illusion-item").html());
    $illusionList = $("#illusion-list");
    $illusionList.html("");
    _ref1 = illusions[currentIllusionList]["list"];
    _results = [];
    for (str_i in _ref1) {
      ill = _ref1[str_i];
      $item = $(templateIllusionItem(ill));
      createDragStart = function() {
        var currentIll, dragStart;
        currentIll = ill;
        dragStart = function() {
          currentDraggingType = DRAGGING_ILLUSION_FROM_LIST;
          return currentDraggingData = currentIll;
        };
        return dragStart;
      };
      $item.on("dragstart", createDragStart());
      _results.push($illusionList.append($item));
    }
    return _results;
  };

  setupDropEvent = function() {
    $(".janish-plus").on("dragover", function(e) {
      e.preventDefault();
      return $(this).addClass("drag-over");
    });
    $(".janish-plus").on("dragleave", function(e) {
      e.preventDefault();
      return $(this).removeClass("drag-over");
    });
    $(".janish-plus").on("drop", function(e) {
      var path;
      if (currentDraggingType = DRAGGING_ILLUSION_FROM_LIST) {
        currentDraggingData;
        path = $(this).attr("path");
        return createJanish(path, currentDraggingData);
      }
    });
    $(".value-output-having").on("click", function(e) {
      var $this, my_name, my_path;
      $this = $(this);
      my_path = $this.closest(".janish").attr("path");
      my_name = $this.closest(".value-item").find(".value-input").html();
      return setInput(null, my_path, my_name);
    });
    $(".value-no").on("dblclick", function(e) {
      var $input, $this, my_name, my_path;
      $this = $(this);
      $input = $("<input class='transparent'>");
      $this.html("").append($input);
      $input.focus();
      my_path = $this.closest(".janish").attr("path");
      my_name = $this.closest(".value-item").find(".value-input").html();
      return $input.on("blur", function() {
        return setInput(this.value, my_path, my_name);
      });
    });
    $(".value-no").on("dragover", function(e) {
      return e.preventDefault();
    });
    $(".value-no").on("drop", function(e) {
      var $this, my_name, my_path, value;
      if (currentDraggingType !== DRAGGING_OUTPUT_FROM_PANEL) {
        return;
      }
      value = currentDraggingData;
      $this = $(this);
      my_path = $this.closest(".janish").attr("path");
      my_name = $this.closest(".value-item").find(".value-input").html();
      return setInput(value, my_path, my_name);
    });
    return $(".value-output-use").on("dragstart", function(e) {
      var $this, id, name, path;
      $this = $(this);
      name = $this.html();
      path = $this.closest(".janish").attr("path").split(".");
      id = path[path.length - 1];
      currentDraggingType = DRAGGING_OUTPUT_FROM_PANEL;
      currentDraggingData = "#" + id + "." + name;
      return console.log(currentDraggingData);
    });
  };

  colHeight = function(col) {
    var $col, $last;
    $col = $("#janish-col-" + col);
    $last = $col.children().last();
    if ($last.length) {
      return $last.position().top + $last.height() + 45;
    } else {
      return 0;
    }
  };

  drawPadding = function(col, height) {
    var $padding;
    if (height - 7 - colHeight(col) > 0) {
      $padding = $("<div></div>");
      $padding.css("height", height - colHeight(col));
      return $("#janish-col-" + col).append($padding);
    }
  };

  janishPlusHtml = $("#template-janish-plus").html();

  createPlus = function(col, path) {
    var $janishPlus;
    $janishPlus = $(janishPlusHtml);
    $janishPlus.attr("path", path);
    return $("#janish-col-" + col).append($janishPlus);
  };

  templateJanishItem = _template($("#template-janish-item").html());

  templateJanishSub = _template($("#template-janish-sub").html());

  drawJanish = function(janish, col, path) {
    var $janish, $sub_header, base_height, c, count, end_top, h, i, illusion, item, j, janishItemValue, key, left, min, name, output, sub_janish, sub_list, sub_path, _i, _j, _k, _len, _len1, _ref, _ref1, _results, _results1;
    if (Array.isArray(janish)) {
      _results = [];
      for (_i = 0, _len = janish.length; _i < _len; _i++) {
        j = janish[_i];
        _results.push(drawJanish(j, col, path + "." + j["id"]));
      }
      return _results;
    } else {
      illusion = illusionDict[janish["illusion"]];
      min = 0;
      for (i = _j = _ref = col + 1; _ref <= 20 ? _j < 20 : _j > 20; i = _ref <= 20 ? ++_j : --_j) {
        h = colHeight(i);
        if (h > min) {
          min = h;
        }
      }
      drawPadding(col, min);
      janishItemValue = JSON.parse(JSON.stringify(illusion));
      janishItemValue["janishInput"] = janish["input"];
      $janish = $(templateJanishItem(janishItemValue));
      $janish.attr("path", path);
      $("#janish-col-" + col).append($janish);
      if (illusion.sub) {
        count = 0;
        sub_list = [];
        _ref1 = illusion.sub;
        for (key in _ref1) {
          output = _ref1[key];
          sub_list.push({
            "name": key,
            "output": output
          });
        }
        sub_list.reverse();
        base_height = $janish.position().top;
        drawLine(col * 380 + 100, base_height + 60, (col + sub_list.length) * 380 + 100, base_height + 60);
        _results1 = [];
        for (_k = 0, _len1 = sub_list.length; _k < _len1; _k++) {
          item = sub_list[_k];
          name = item["name"];
          output = item["output"];
          sub_path = path + "|" + name;
          c = col + Object.keys(illusion.sub).length - count;
          count++;
          drawPadding(c, base_height);
          $sub_header = $(templateJanishSub(item));
          $sub_header.attr("path", path);
          $("#janish-col-" + c).append($sub_header);
          if (janish["sub"] && janish["sub"][name]) {
            sub_janish = janish["sub"][name];
            drawJanish(sub_janish, c, sub_path);
          }
          createPlus(c, sub_path);
          left = c * 380 + 230;
          end_top = $("#janish-col-" + c).children().last().position().top;
          _results1.push(drawLine(left, base_height + 60, left, end_top + 70));
        }
        return _results1;
      }
    }
  };

  loadJanish = function() {
    var $item, $janishPanel, end_p, i, start_p, _i;
    console.log(panel_janish);
    clearContext();
    $janishPanel = $("#janish-panel");
    $janishPanel.html("");
    for (i = _i = 0; _i < 20; i = ++_i) {
      $item = $('<div class="janish-col"></div>');
      $item.attr("id", "janish-col-" + i);
      $janishPanel.append($item);
    }
    drawJanish(panel_janish, 0, "main");
    createPlus(0, "main");
    start_p = $("#janish-col-0").children().first().position();
    end_p = $("#janish-col-0").children().last().position();
    drawLine(start_p.left + 150, start_p.top + 30, end_p.left + 150, end_p.top + 70);
    return setupDropEvent();
  };

  documentReady = function() {
    return $.ajax({
      "url": "illusions.json",
      "dataType": "json",
      "success": function(data) {
        illusions = data;
        loadIllusions();
        return loadJanish();
      }
    });
  };

  $(document).ready(documentReady);

  monitorShowed = false;

  window.displayMonitor = function() {
    if (monitorShowed) {
      $("#code").hide();
      $("#monitor").removeClass("current");
    } else {
      $("#code").show();
      $("#monitor").addClass("current");
    }
    return monitorShowed = !monitorShowed;
  };

  window.displayRun = function() {
    return $("#run").show();
  };

  window.hideRun = function() {
    return $("#run").hide();
  };

}).call(this);

//# sourceMappingURL=editor.js.map
