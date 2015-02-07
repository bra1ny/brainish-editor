
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
        [{
          "id": "print_1",
          "illusion": "PRINT",
          "input": {
            "content": "#for_each_1.iterator"
          }
        },
          {
            "id": "for_each_2",
            "illusion": "FOR",
            "input": {
              "list": "#list_file_1.file_list"
            }
          }
        ]
    }
  }
  {
    "id": "print_2",
    "illusion": "PRINT",
    "input": {
      "content": "meh"
    }
  }
]


add_janish = (path, new_janish) ->
  # pass


add_janish("main.for_each_1|test", {"hello": "world"})
add_janish("main.for_each_1|body.for_each_2|test", {"hello": "world"})