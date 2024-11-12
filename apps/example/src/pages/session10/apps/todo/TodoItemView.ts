import {html, on, View} from "rune-ts";
import {CheckView} from "../../ui/CheckView";
import {Toggled} from "../../ui/Toggled";
import {TodoRemoveRequested} from "./TodoRemoveRequested";
import type {Todo} from "./Todo";

export class TodoItemView extends View<Todo> {
  private _checkView = new CheckView({ on: this.data.completed });

  override template() {
    return html`
      <div class="${this.data.completed ? 'completed' : ''}">
        ${this._checkView}
        <span class="title">${this.data.title}</span>
        <button class="remove">x</button>
      </div>
    `;
  }

  @on('click', '.remove')
  private _remove() {
    this.dispatchEvent(TodoRemoveRequested, { detail: this.data, bubbles: true });
  }

  @on(Toggled)
  private _syncCompleted() {
    this.data.completed = this._checkView.data.on;
    this.element().classList.toggle('completed', this.data.completed);
  }

  setCompleted(bool: boolean) {
    this._checkView.setOn(bool);
    this._syncCompleted();
  }
}