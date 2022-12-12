import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { javascript } from '@codemirror/lang-javascript';
import { lintGutter } from "@codemirror/lint";
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';

const config = {
	// eslint configuration
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: "module",
	},
	env: {
		browser: true,
		node: true,
	},
	rules: {
		semi: ["error", "never"],
	},
};

@Component({
  selector: 'blinkstick-editor-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements AfterViewInit {
  @Input()
  public readOnly = false;

  @Output()
  public changed = new EventEmitter();

  @ViewChild("code")
  public code?: ElementRef<HTMLDivElement>;

  public editor?: EditorView;

  ngAfterViewInit(): void {
    this.editor = new EditorView({ parent: this.code?.nativeElement, extensions: [
      basicSetup,
      javascript({typescript: true}),
  		lintGutter(),
      EditorView.updateListener.of((update) => update.docChanged ? this.changed.emit(): undefined)
    ]});
//[EditorState.readOnly.of(this.readOnly)]
  }
}
