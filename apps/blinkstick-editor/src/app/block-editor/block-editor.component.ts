import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import * as DE from 'blockly/msg/de';

@Component({
  selector: 'blinkstick-editor-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss'],
})
export class BlockEditorComponent implements OnInit {
  @Output()
  public changed = new EventEmitter();

  private readonly toolbox = {
    kind: "categoryToolbox",
    contents: [
      { kind: 'category', name: 'Stufe 1', contents: [
        { kind: "block", type: "blinkstick_setColor" },
        { kind: "block", type: "math_number" },
        { kind: "block", type: "colour_picker"},
      ]},
      { kind: 'category', name: 'Stufe 2', contents: [
        { kind: "block", type: "blinkstick_setColor" },
        { kind: "block", type: "math_number" },
        { kind: "block", type: "colour_picker"},
        { kind: "block", type: "controls_if"},
      ]},
      { kind: 'category', name: 'Alles', contents: [
        { kind: 'category', name: 'BlinkStick', contents: [
          { kind: "block", type: "blinkstick_setColor" },
        ]},
        { kind: 'category', name: 'Farben', contents: [
          { kind: "block", type: "colour_blend" },
          { kind: "block", type: "colour_picker" },
          { kind: "block", type: "colour_random" },
          { kind: "block", type: "colour_rgb" },
        ]},
        { kind: 'category', name: 'Kontrollfluss', contents: [
          { kind: "block", type: "controls_flow_statements" },
          { kind: "block", type: "controls_for" },
          { kind: "block", type: "controls_forEach" },
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "controls_if_else" },
          { kind: "block", type: "controls_if_elseif" },
          { kind: "block", type: "controls_if_if" },
          { kind: "block", type: "controls_ifelse" },
          { kind: "block", type: "controls_repeat" },
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_wait" },
          { kind: "block", type: "controls_stopIfRequested" },
        ]},
        { kind: 'category', name: 'Listen', contents: [

          { kind: "block", type: "lists_create_empty" },
          { kind: "block", type: "lists_create_with" },
          { kind: "block", type: "lists_create_with_container" },
          { kind: "block", type: "lists_create_with_item" },
          { kind: "block", type: "lists_getIndex" },
          { kind: "block", type: "lists_getSublist" },
          { kind: "block", type: "lists_indexOf" },
          { kind: "block", type: "lists_isEmpty" },
          { kind: "block", type: "lists_length" },
          { kind: "block", type: "lists_repeat" },
          { kind: "block", type: "lists_reverse" },
          { kind: "block", type: "lists_setIndex" },
          { kind: "block", type: "lists_sort" },
          { kind: "block", type: "lists_split" },
        ]},
        { kind: 'category', name: 'Logik', contents: [

          { kind: "block", type: "logic_boolean" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_negate" },
          { kind: "block", type: "logic_null" },
          { kind: "block", type: "logic_operation" },
          { kind: "block", type: "logic_ternary" },
        ]},
        { kind: 'category', name: 'Rechnen', contents: [

          { kind: "block", type: "math_arithmetic" },
          { kind: "block", type: "math_atan2" },
          { kind: "block", type: "math_change" },
          { kind: "block", type: "math_constant" },
          { kind: "block", type: "math_constrain" },
          { kind: "block", type: "math_modulo" },
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_number_property" },
          { kind: "block", type: "math_on_list" },
          { kind: "block", type: "math_random_float" },
          { kind: "block", type: "math_random_int" },
          { kind: "block", type: "math_round" },
          { kind: "block", type: "math_single" },
          { kind: "block", type: "math_trig" },
        ]},
        { kind: 'category', name: 'Unterprogramme', contents: [
          { kind: "block", type: "procedures_callnoreturn" },
          { kind: "block", type: "procedures_callreturn" },
          { kind: "block", type: "procedures_defnoreturn" },
          { kind: "block", type: "procedures_defreturn" },
          { kind: "block", type: "procedures_ifreturn" },
          { kind: "block", type: "procedures_mutatorarg" },
          { kind: "block", type: "procedures_mutatorcontainer" },
        ]},
        { kind: 'category', name: 'Text', contents: [

          { kind: "block", type: "text" },
          { kind: "block", type: "text_append" },
          { kind: "block", type: "text_changeCase" },
          { kind: "block", type: "text_charAt" },
          { kind: "block", type: "text_count" },
          { kind: "block", type: "text_create_join_container" },
          { kind: "block", type: "text_create_join_item" },
          { kind: "block", type: "text_getSubstring" },
          { kind: "block", type: "text_indexOf" },
          { kind: "block", type: "text_isEmpty" },
          { kind: "block", type: "text_join" },
          { kind: "block", type: "text_length" },
          { kind: "block", type: "text_multiline" },
          { kind: "block", type: "text_print" },
          { kind: "block", type: "text_prompt" },
          { kind: "block", type: "text_prompt_ext" },
          { kind: "block", type: "text_replace" },
          { kind: "block", type: "text_reverse" },
          { kind: "block", type: "text_trim" },
        ]},
        { kind: 'category', name: 'Variablen', contents: [

          { kind: "block", type: "variables_get" },
          { kind: "block", type: "variables_get_dynamic" },
          { kind: "block", type: "variables_set" },
          { kind: "block", type: "variables_set_dynamic" },
        ]},
      ]},
    ]
  }

  public workspace?: Blockly.Workspace;

  ngOnInit(): void {
    Blockly.setLocale(DE);
    Blockly.defineBlocksWithJsonArray([{
      type: "blinkstick_setColor",
      message0: "Setze LED %1 auf Farbe %2",
      args0: [
        {type: "input_value", name: "POSITION", check: "Number"},
        {type: "input_value", name: "COLOR", check: "Colour"}
      ],
      colour: 160,
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      tooltip: "Setzt die Farbe auf der genannten Position.",
    }, {
      type: "controls_wait",
      message0: "Warte für %1 Sekunden",
      args0: [
        {type: "input_value", name: "SECONDS", check: "Number"},
      ],
      colour: 120,
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      tooltip: "Warte die angegebenen Sekunden.",
    }, {
      type: "controls_stopIfRequested",
      message0: "Stop, wenn gewünscht",
      colour: 120,
      previousStatement: null,
      nextStatement: null,
      tooltip: "Stop, wenn gewünscht.",
    }]);

    javascriptGenerator['blinkstick_setColor'] = (block: Blockly.Block) => {
      const position = javascriptGenerator.valueToCode(block, 'POSITION', javascriptGenerator.ORDER_NONE) || 0;
      const color = javascriptGenerator.valueToCode(block, 'COLOR', javascriptGenerator.ORDER_MEMBER) || '\'#000000\'';
      const code = `setzeFarbe(${position}, FarbeHex(${color}));\n`;
      return code;
    };

    javascriptGenerator['controls_wait'] = (block: Blockly.Block) => {
      const seconds = javascriptGenerator.valueToCode(block, 'SECONDS', javascriptGenerator.ORDER_NONE) || 0;
      const code = `await warte(${seconds});\n`;
      return code;
    };

    javascriptGenerator['controls_stopIfRequested'] = (block: Blockly.Block) => {
      const code = `if (!context.shouldRun) { return; };\n`;
      return code;
    };

    console.log(Blockly.Blocks);
    this.workspace = Blockly.inject('blocklyDiv', {
      toolbox: this.toolbox,
      toolboxPosition: "2",
      scrollbars: true
    });

    this.workspace.addChangeListener(() => {
      this.changed.emit();
    });
  }
};
