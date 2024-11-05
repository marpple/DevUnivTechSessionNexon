import {html, View} from "rune-ts";
import {CheckView} from "../ui/CheckView";
import {Toggled} from "../ui/Toggled";
import {SwitchView} from "../ui/SwichView";
import {ListView} from "../ui/ListView";
import {CheckableViewController} from "../ui/CheckableViewController";
import {CheckListController} from "../ui/CheckListController";

interface Todo {
  title: string;
  completed: boolean;
}

class TodoItemView extends View<Todo> {
  private _checkView = new CheckView({ on: this.data.completed });

  override template() {
    return html`
      <div>
        ${this._checkView}
        <span class="title">${this.data.title}</span>
      </div>
    `;
  }

  protected override onRender() {
    this._checkView.addEventListener(Toggled, (e) => this._syncCompleted(e.detail.on));
  }

  private _syncCompleted(on: boolean) {
    this.data.completed = on;
  }

  setCompleted(bool: boolean) {
    this._syncCompleted(bool);
    this._checkView.setOn(bool);
  }
}

class TodoListView extends ListView<Todo, TodoItemView> {
  createItemView(itemData: Todo) {
    return new TodoItemView(itemData);
  }
}

class TodoPage extends View<Todo[]> {
  private _checkListViewController = new CheckListController(
    new CheckView({ on: false }),
    new TodoListView(this.data),
    (itemView) => itemView.data.completed,
    (itemView, bool) => itemView.setCompleted(bool)
  );

  override template() {
    return html`
      <div>
        <div class="header">
          ${this._checkListViewController.checkAllView}
          <input type="text">
        </div>
        <div class="body">
          ${this._checkListViewController.listView}
        </div>
      </div>
    `;
  }
}

export function todo() {
  const todos: Todo[] = [
    { title: 'Coding', completed: false },
    { title: 'Dinner', completed: true },
    { title: 'Test', completed: false },
  ];

  document.querySelector('#body')!.append(
    new TodoPage(todos).render()
  );
}