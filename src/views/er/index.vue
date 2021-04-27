<template>
  <div id="sample" class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content ">
          <Reader ref="readerone" />
        </div></el-col>
      <el-col :span="8">
        <div class="grid-content ">
          <Writer ref="writer" />
        </div></el-col>
      <el-col :span="4">
        <div class="gird-content" style="margin-top: 8px">
          <el-checkbox v-model="checkedatt">属性</el-checkbox>
          <el-checkbox v-model="checkedins">实例</el-checkbox>
          <div /></div></el-col>
      <el-col :span="4">
        <div class="grid-content ">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="load"
          /></div></el-col>
    </el-row>
    <div id="displays" style="width: 100%; white-space: nowrap; ">
      <div
        id="myDiagramDiv"
        style="
          border: solid 1px black;
          height: 590px;
          display: inline-block;
          vertical-align: top;
          width: 100%;
        "
      />
    </div>
    <el-button type="primary" icon="el-icon-edit" @click="load">load</el-button>
    <el-button type="primary" @click="save">save<i class="el-icon-upload el-icon--right" /></el-button>
    <el-input v-model="modelName" placeholder="请输入名字" />
    <div>
      Diagram Model saved in JSON format, automatically updated after each
      change or undo or redo:
      <el-input
        v-model="mySavedModel"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8}"
        placeholder="请输入内容"
        style="width:100%;"
      />
    </div>
  </div>
</template>
<script>
import Reader from './reader'
import Writer from './writer'
import go from 'gojs'
import { fetchGojsData, createGojsData } from '@/api/ersim'
var $ = go.GraphObject.make // for conciseness in defining templates
function getInfo(model, obj) {
  var x = obj.panel.adornedPart // the object that the mouse is over
  var text = '' // what will be displayed
  if (x instanceof go.Node) {
    if (x instanceof go.Group) text += 'Group: '
    else text += 'Node: '
    text += x.data.key
    var toLst = nodesTo(x, 0) // display names of nodes going into this node
    if (toLst.count > 0) {
      toLst.sort(function(a, b) {
        return a < b ? -1 : 1
      })
      text += '\nNodes into: '
      toLst.each(function(key) {
        if (key !== text.substring(text.length - 3, text.length - 2)) {
          text += key + ', '
        }
      })
      text = text.substring(0, text.length - 2)
    }
    var frLst = nodesFrom(x, 0) // display names of nodes coming out of this node
    if (frLst.count > 0) {
      frLst.sort(function(a, b) {
        return a < b ? -1 : 1
      })
      text += '\nNodes out of: '
      frLst.each(function(key) {
        if (key !== text.substring(text.length - 3, text.length - 2)) {
          text += key + ', '
        }
      })
      text = text.substring(0, text.length - 2)
    }
    var grpC = containing(x, 0) // if the node is in a group, display its name
    if (grpC !== null) text += '\nContaining SubGraph: ' + grpC.data.key
    if (x instanceof go.Group) {
      // if it"s a group, also display nodes and links contained in it
      text += '\nMember nodes: '
      var children = childNodes(x, 0)
      children.sort(function(a, b) {
        return a < b ? -1 : 1
      })
      children.each(function(key) {
        if (key !== text.substring(text.length - 3, text.length - 2)) {
          text += key + ', '
        }
      })
      text = text.substring(0, text.length - 2)

      var linkChildren = childLinks(x, 0)
      if (linkChildren.count > 0) {
        text += '\nMember links: '
        var linkStrings = new go.List(/* "string"*/)
        linkChildren.each(function(link) {
          linkStrings.add(link.data.from + ' --> ' + link.data.to)
        })
        linkStrings.sort(function(a, b) {
          return a < b ? -1 : 1
        })
        linkStrings.each(function(str) {
          text += str + ', '
        })
        text = text.substring(0, text.length - 2)
      }
    }
  } else if (x instanceof go.Link) {
    // if it"s a link, display its to and from nodes
    text +=
      'Link: ' +
      x.data.from +
      ' --> ' +
      x.data.to +
      '\nNode To: ' +
      x.data.to +
      '\nNode From: ' +
      x.data.from
    var grp = containing(x, 0) // and containing group, if it has one
    if (grp !== null) text += '\nContaining SubGraph: ' + grp.data.key
  }
  return text
}
export default {
  components: { Reader, Writer },
  data() {
    return {
      temp: {},
      mySavedModel: '',
      modelName: '',
      mySavedModelID: 7,
      checkedatt: false,
      checkedins: false,
      myDiagram: '',
      nodeDataArray: [],
      linkDataArray: []
    }
  },
  mounted() {
    this.myDiagram = $(
      go.Diagram,
      'myDiagramDiv', // Diagram refers to its DIV HTML element by id
      {
        maxSelectionCount: 1 // no more than 1 element can be selected at a time
      }
    )
    this.init()
  },
  methods: {
    createData() {
      this.temp.name = this.modelName
      this.temp.data = this.mySavedModel
      createGojsData(this.temp).then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000 })
      })
    },
    // Show the diagram's model in JSON format
    save() {
      this.mySavedModel = this.myDiagram.model.toJson()
      this.myDiagram.isModified = false
      this.createData()
    },
    load() {
      const readerDataone = this.$refs.readerone.getData()
      const readerDatatwo = this.$refs.writer.getData()
      if ((readerDataone.datasourceId === undefined) || (readerDatatwo.datasourceId === undefined) || !(this.checkedatt || this.checkedins)) {
        this.$notify.error({
          title: '错误',
          message: '请正确选择对比条件'
        })
      } else {
        fetchGojsData(this.mySavedModelID).then((response) => {
          this.mySavedModel = response.data[0].fields.data
          this.myDiagram.model = go.Model.fromJson(this.mySavedModel)
          this.$notify({
            title: 'Success',
            message: 'Return Successfully',
            type: 'success',
            duration: 2000 })
        })
        if (this.mySavedModelID >= 8) { this.mySavedModelID = 7 } else { this.mySavedModelID += 1 }
      }
    },
    showModel() {
      this.mySavedModel = this.myDiagram.model.toJson()
    },
    layout() {
      this.myDiagram.layoutDiagram(true)
    },
    init() {
      // This template is a Panel that is used to represent each item in a Panel.itemArray.
      // The Panel is data bound to the item object.
      var fieldTemplate = $(
        go.Panel,
        'TableRow', // this Panel is a row in the containing Table
        new go.Binding('portId', 'name'), // this Panel is a "port"
        {
          background: 'transparent', // so this port's background can be picked by the mouse
          fromSpot: go.Spot.Right, // links only go from the right side to the left side
          toSpot: go.Spot.Left,
          // allow drawing links from or to this port:
          fromLinkable: true,
          toLinkable: true
        },
        $(
          go.Shape,
          {
            width: 12,
            height: 12,
            column: 0,
            strokeWidth: 2,
            margin: 4,
            // but disallow drawing links from or to this shape:
            fromLinkable: false,
            toLinkable: false
          },
          new go.Binding('figure', 'figure'),
          new go.Binding('fill', 'color')
        ),
        $(
          go.TextBlock,
          {
            margin: new go.Margin(0, 5),
            column: 1,
            font: 'bold 13px sans-serif',
            alignment: go.Spot.Left,
            // and disallow drawing liis text:
            fromLinkable: false,
            toLinkable: false
          },
          new go.Binding('text', 'name')
        )
      )
      // define the node template
      this.myDiagram.nodeTemplate = $(
        go.Node,
        'Auto',
        { copyable: false, deletable: false },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        // this rectangular shape surrounds the content of the node
        $(go.Shape, { fill: '#EEEEEE' }),
        // the content consists of a header and a list of items
        $(
          go.Panel,
          'Vertical',
          // this is the header for the whole node
          $(
            go.Panel,
            'Auto',
            { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
            $(go.Shape, { fill: '#1570A6', stroke: null }),
            $(
              go.TextBlock,
              {
                alignment: go.Spot.Center,
                margin: 3,
                stroke: 'white',
                textAlign: 'center',
                font: 'bold 12pt sans-serif'
              },
              new go.Binding('text', 'key')
            )
          ),
          // this Panel holds a Panel for each item object in the itemArray;
          // each item Panel is defined by the itemTemplate to be a TableRow in this Table
          $(
            go.Panel,
            'Table',
            {
              padding: 2,
              minSize: new go.Size(100, 10),
              defaultStretch: go.GraphObject.Horizontal,
              itemTemplate: fieldTemplate
            },
            new go.Binding('itemArray', 'fields')
          ) // end Table Panel of items
        ) // end Vertical Panel
      ) // end Node

      // define the link template
      this.myDiagram.linkTemplate = $(
        go.Link,
        {
          relinkableFrom: true,
          relinkableTo: true, // let user reconnect links
          selectionAdornmentTemplate: $(
            go.Adornment,
            $(go.Shape, {
              isPanelMain: true,
              stroke: 'dodgerblue',
              strokeWidth: 3
            }),
            $(go.Shape, {
              toArrow: 'Standard',
              fill: 'dodgerblue',
              stroke: null,
              scale: 1
            })
          ),
          routing: go.Link.Orthogonal,
          corner: 5,
          toShortLength: 2
        },
        $(
          go.Shape, //  the link shape
          { name: 'OBJSHAPE' }
        ),
        // $(
        //   go.Shape, //  the arrowhead
        //   { name: 'ARWSHAPE', toArrow: 'Standard' }
        // ),
        {
          //  define a tooltip for each link that displays its information
          toolTip: $(
            'ToolTip',
            $(go.TextBlock, { margin: 4 }, new go.Binding('text', '', getInfo))
          )
        }
      )

      // define the group template
      this.myDiagram.groupTemplate = $(
        go.Group,
        'Spot',
        {
          // adornment when a group is selected
          selectionAdornmentTemplate: $(
            go.Adornment,
            'Auto',
            $(go.Shape, 'Rectangle', {
              fill: null,
              stroke: 'dodgerblue',
              strokeWidth: 3
            }),
            $(go.Placeholder)
          ),
          toSpot: go.Spot.AllSides, // links coming into groups at any side
          toEndSegmentLength: 30,
          fromEndSegmentLength: 30
        },
        $(
          go.Panel,
          'Auto',
          $(
            go.Shape,
            'Rectangle',
            {
              name: 'OBJSHAPE',
              parameter1: 14,
              fill: 'rgba(255,0,0,0.10)'
            },
            new go.Binding('desiredSize', 'ds')
          ),
          $(go.Placeholder, { padding: 16 })
        ),
        $(
          go.TextBlock,
          {
            name: 'GROUPTEXT',
            alignment: go.Spot.TopLeft,
            alignmentFocus: new go.Spot(0, 0, -4, -4),
            font: 'Bold 10pt Sans-Serif'
          },
          new go.Binding('text', 'key')
        ),
        {
          //  define a tooltip for each group that displays its information
          toolTip: $(
            'ToolTip',
            $(go.TextBlock, { margin: 4 }, new go.Binding('text', '', getInfo))
          )
        }
      )

      // add nodes, including groups, and links to the model
      //   this.myDiagram.model = new go.GraphLinksModel(
      //     [
      //       // node data
      //       { key: "A", loc: new go.Point(320, 100) },
      //       { key: "B", loc: new go.Point(420, 200) },
      //       { key: "C", group: "Psi", loc: new go.Point(250, 225) },
      //       { key: "D", group: "Omega", loc: new go.Point(270, 325) },
      //       { key: "E", group: "Phi", loc: new go.Point(120, 225) },
      //       { key: "F", group: "Omega", loc: new go.Point(200, 350) },
      //       { key: "G", loc: new go.Point(180, 450) },
      //       { key: "Chi", isGroup: true },
      //       { key: "Psi", isGroup: true, group: "Chi" },
      //       { key: "Phi", isGroup: true, group: "Psi" },
      //       { key: "Omega", isGroup: true, group: "Psi" },
      //     ],
      //     [
      //       // link data
      //       { from: "A", to: "B" },
      //       { from: "A", to: "C" },
      //       { from: "A", to: "C" },
      //       { from: "B", to: "B" },
      //       { from: "B", to: "C" },
      //       { from: "B", to: "Omega" },
      //       { from: "C", to: "A" },
      //       { from: "C", to: "Psi" },
      //       { from: "C", to: "D" },
      //       { from: "D", to: "F" },
      //       { from: "E", to: "F" },
      //       { from: "F", to: "G" },
      //     ]
      //   );
      this.myDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: [],
        linkDataArray: []
      })

      // whenever selection changes, run updateHighlights
      this.myDiagram.addDiagramListener('ChangedSelection', () => {
        // this.updateHighlights(this.getRadioButton());
        this.updateHighlights('fixed')
      })

      this.myDiagram.select(this.myDiagram.findNodeForKey('C'))
    },

    // This highlights all graph objects that should be highlighted
    // whenever a radio button is checked or selection changes.
    // Parameter e is the checked radio button.
    updateHighlights(e) {
      // Set highlight to 0 for everything before updating
      this.myDiagram.nodes.each(function(node) {
        node.highlight = 0
      })
      this.myDiagram.links.each(function(link) {
        link.highlight = 0
      })

      // Get the selected GraphObject and run the appropriate method
      var sel = this.myDiagram.selection.first()
      if (sel !== null) {
        // switch (e.id) {
        switch ('linksAll') {
          case 'linksIn':
            linksTo(sel, 1)
            break
          case 'linksOut':
            linksFrom(sel, 1)
            break
          case 'linksAll':
            this.linksAll(sel, 1)
            break
          case 'nodesIn':
            nodesTo(sel, 1)
            break
          case 'nodesOut':
            nodesFrom(sel, 1)
            break
          case 'nodesConnect':
            this.nodesConnect(sel, 1)
            break
          case 'nodesReach':
            nodesReach(sel, 1)
            break
          case 'group':
            containing(sel, 1)
            break
          case 'groupsAll':
            containingAll(sel, 1)
            break
          case 'nodesMember':
            childNodes(sel, 1)
            break
          case 'nodesMembersAll':
            allMemberNodes(sel, 1)
            break
          case 'linksMember':
            childLinks(sel, 1)
            break
          case 'linksMembersAll':
            allMemberLinks(sel, 1)
            break
        }
      }

      // Give everything the appropriate highlighting ( color and width of stroke )
      // nodes, including groups
      //   this.myDiagram.nodes.each((node) => {
      //     var shp = node.findObject("OBJSHAPE");
      //     var grp = node.findObject("GROUPTEXT");
      //     var hl = node.highlight;
      //     this.highlight(shp, grp, hl);
      //   });
      // links
      this.myDiagram.links.each(link => {
        var hl = link.highlight
        var shp = link.findObject('OBJSHAPE')
        var arw = link.findObject('ARWSHAPE')
        console.log('function out:', shp)
        this.highlight(shp, arw, hl)
      })
    },

    // Functions for highlighting, called by updateHighlights.
    // x in each case is the selected object or the object being treated as such.
    // Some have return values for use by each other or for tooltips.

    // if the link connects to this node, highlight it
    linksTo(x, i) {
      if (x instanceof go.Node) {
        x.findLinksInto().each(function(link) {
          link.highlight = i
        })
      }
    },

    // if the link comes from this node, highlight it
    linksFrom(x, i) {
      if (x instanceof go.Node) {
        x.findLinksOutOf().each(function(link) {
          link.highlight = i
        })
      }
    },

    // highlight all links connected to this node
    linksAll(x, i) {
      if (x instanceof go.Node) {
        x.linksConnected.each(function(link) {
          link.highlight = i
        })
      }
    },

    // If selected object is a link, highlight its fromNode.
    // Otherwise highlight the fromNode of each link coming into the selected node.
    // Return a List of the keys of the nodes.
    nodesTo(x, i) {
      var nodesToList = new go.List(/* "string"*/)
      if (x instanceof go.Link) {
        x.fromNode.highlight = i
        nodesToList.add(x.data.from)
      } else {
        x.findNodesInto().each(function(node) {
          node.highlight = i
          nodesToList.add(node.data.key)
        })
      }
      return nodesToList
    },

    // same as nodesTo, but 'from' instead of 'to'
    nodesFrom(x, i) {
      var nodesFromList = new go.List(/* "string"*/)
      if (x instanceof go.Link) {
        x.toNode.highlight = i
        nodesFromList.add(x.data.to)
      } else {
        x.findNodesOutOf().each(function(node) {
          node.highlight = i
          nodesFromList.add(node.data.key)
        })
      }
      return nodesFromList
    },

    // If x is a link, highlight its toNode, or if it is a node, the node(s) it links to,
    // and then call nodesReach on the highlighted node(s), with the next color.
    // Do not highlight any node that has already been highlit with a color
    // indicating a closer relationship to the original node.
    nodesReach(x, i) {
      if (x instanceof go.Link) {
        x.toNode.highlight = i
        nodesReach(x.toNode, i + 1)
      } else {
        x.findNodesOutOf().each(function(node) {
          if (node.highlight === 0 || node.highlight > i) {
            node.highlight = i
            nodesReach(node, i + 1)
          }
        })
      }
    },

    // highlight all nodes linked to this one
    nodesConnect(x, i) {
      if (x instanceof go.Link) {
        x.toNode.highlight = i
        x.fromNode.highlight = i
      } else {
        x.findNodesConnected().each(function(node) {
          node.highlight = i
        })
      }
    },

    // highlights the group containing this object, specific method for links
    // returns the containing group of x
    containing(x, i) {
      var container = x.containingGroup
      if (container !== null) container.highlight = i
      return container
    },

    // container is the group that contains this node and
    // will be the parameter x for the next call of this function.
    // Calling containing(x,i) highlights each group the appropriate color
    containingAll(x, i) {
      containing(x, i)
      var container = x.containingGroup
      if (container !== null) containingAll(container, i + 1)
    },

    // if the Node"s containingGroup is x, highlight it
    childNodes(x, i) {
      var childLst = new go.List(/* "string"*/)
      if (x instanceof go.Group) {
        myDiagram.nodes.each(function(node) {
          if (node.containingGroup === x) {
            node.highlight = i
            childLst.add(node.data.key)
          }
        })
      }
      return childLst
    },

    // same as childNodes, then run allMemberNodes for each child Group with the next color
    allMemberNodes(x, i) {
      if (x instanceof go.Group) {
        myDiagram.nodes.each(function(node) {
          if (node.containingGroup === x) {
            node.highlight = i
            allMemberNodes(node, i + 1)
          }
        })
      }
    },

    // if the link"s containing Group is x, highlight it
    childLinks(x, i) {
      var childLst = new go.List(/* go.Link*/)
      myDiagram.links.each(function(link) {
        if (link.containingGroup === x) {
          link.highlight = i
          childLst.add(link)
        }
      })
      return childLst
    },

    // same as childLinks, then run allMemberLinks for each child Group with the next color
    allMemberLinks(x, i) {
      childLinks(x, i)
      myDiagram.nodes.each(function(node) {
        if (node instanceof go.Group && node.containingGroup === x) {
          allMemberLinks(node, i + 1)
        }
      })
    },

    // perform the actual highlighting
    highlight(shp, obj2, hl) {
      var color
      var width = 3
      if (hl === 0) {
        color = 'black'
        width = 1
      } else if (hl === 1) {
        color = 'blue'
      } else if (hl === 2) {
        color = 'green'
      } else if (hl === 3) {
        color = 'orange'
      } else if (hl === 4) {
        color = 'red'
      } else {
        color = 'purple'
      }
      console.log('function highlight', shp)
      shp.stroke = color
      shp.strokeWidth = width
      if (obj2 !== null) {
        obj2.stroke = color
        obj2.fill = color
      }
    },

    // return the selected radio button in "highlight"
    getRadioButton() {
      var radio = document.getElementsByName('highlight')
      for (var i = 0; i < radio.length; i++) { if (radio[i].checked) return radio[i] }
    }

    // returns the text for a tooltip, param obj is the text itself
    // getInfo(model, obj) {
    //   var x = obj.panel.adornedPart; // the object that the mouse is over
    //   var text = ""; // what will be displayed
    //   if (x instanceof go.Node) {
    //     if (x instanceof go.Group) text += "Group: ";
    //     else text += "Node: ";
    //     text += x.data.key;
    //     var toLst = nodesTo(x, 0); // display names of nodes going into this node
    //     if (toLst.count > 0) {
    //       toLst.sort(function (a, b) {
    //         return a < b ? -1 : 1;
    //       });
    //       text += "\nNodes into: ";
    //       toLst.each(function (key) {
    //         if (key !== text.substring(text.length - 3, text.length - 2)) {
    //           text += key + ", ";
    //         }
    //       });
    //       text = text.substring(0, text.length - 2);
    //     }
    //     var frLst = nodesFrom(x, 0); // display names of nodes coming out of this node
    //     if (frLst.count > 0) {
    //       frLst.sort(function (a, b) {
    //         return a < b ? -1 : 1;
    //       });
    //       text += "\nNodes out of: ";
    //       frLst.each(function (key) {
    //         if (key !== text.substring(text.length - 3, text.length - 2)) {
    //           text += key + ", ";
    //         }
    //       });
    //       text = text.substring(0, text.length - 2);
    //     }
    //     var grpC = containing(x, 0); // if the node is in a group, display its name
    //     if (grpC !== null) text += "\nContaining SubGraph: " + grpC.data.key;
    //     if (x instanceof go.Group) {
    //       // if it"s a group, also display nodes and links contained in it
    //       text += "\nMember nodes: ";
    //       var children = childNodes(x, 0);
    //       children.sort(function (a, b) {
    //         return a < b ? -1 : 1;
    //       });
    //       children.each(function (key) {
    //         if (key !== text.substring(text.length - 3, text.length - 2)) {
    //           text += key + ", ";
    //         }
    //       });
    //       text = text.substring(0, text.length - 2);

    //       var linkChildren = childLinks(x, 0);
    //       if (linkChildren.count > 0) {
    //         text += "\nMember links: ";
    //         var linkStrings = new go.List(/*"string"*/);
    //         linkChildren.each(function (link) {
    //           linkStrings.add(link.data.from + " --> " + link.data.to);
    //         });
    //         linkStrings.sort(function (a, b) {
    //           return a < b ? -1 : 1;
    //         });
    //         linkStrings.each(function (str) {
    //           text += str + ", ";
    //         });
    //         text = text.substring(0, text.length - 2);
    //       }
    //     }
    //   } else if (x instanceof go.Link) {
    //     // if it"s a link, display its to and from nodes
    //     text +=
    //       "Link: " +
    //       x.data.from +
    //       " --> " +
    //       x.data.to +
    //       "\nNode To: " +
    //       x.data.to +
    //       "\nNode From: " +
    //       x.data.from;
    //     var grp = containing(x, 0); // and containing group, if it has one
    //     if (grp !== null) text += "\nContaining SubGraph: " + grp.data.key;
    //   }
    //   return text;
    // },
  }
}
</script>
