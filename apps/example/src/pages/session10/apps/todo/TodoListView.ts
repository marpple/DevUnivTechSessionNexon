import {ListView} from "rune-ts";
import {TodoItemView} from "./TodoItemView";
import type {Todo} from "./Todo";
import {TodoRemoveRequested} from "./TodoRemoveRequested";

export class TodoListView extends ListView<Todo, TodoItemView> {
  ItemView = TodoItemView;

  override onRender() {
    this.addEventListener(TodoRemoveRequested, ({ detail}) => this.remove(detail));
  }
}
