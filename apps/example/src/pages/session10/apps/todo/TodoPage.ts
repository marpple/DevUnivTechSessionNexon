import {html, View} from "rune-ts";
import {CheckView} from "../../ui/CheckView";
import {Toggled} from "../../ui/Toggled";
import {CheckListController} from "../../ui/CheckListController";
import {SegmentControlView, SegmentSelected} from "../../ui/SegmentControlView";
import {InputTextReturned, InputTextReturnEnterView} from "../../ui/InputTextReturnEnterView";
import type {Todo} from "./Todo";
import {TodoRemoveRequested} from "./TodoRemoveRequested";
import {TodoListView} from "./TodoListView";

class TodoPage extends View<Todo[]> {
  private _checkAllController = new CheckListController(
    new CheckView(),
    new TodoListView([...this.data]),
    (itemView) => itemView.data.completed,
    (itemView, bool) => itemView.setCompleted(bool)
  );

  private _filterView = new SegmentControlView([
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Completed', value: 'completed' }
  ]);

  private get _filterState() {
    return this._filterView.selectedSegment();
  }

  override template() {
    return html`
      <div>
        <div class="header">
          ${this._checkAllController.checkAllView}
          ${new InputTextReturnEnterView({})}
        </div>
        <div class="body">
          ${this._checkAllController.listView}
          <div class="filter">${this._filterView}</div
        </div>
      </div>
    `;
  }

  override onRender() {
    this.addEventListener(Toggled, () => this._refresh());
    this.addEventListener(SegmentSelected, () => this._refresh());
    this.addEventListener(InputTextReturned, ({ detail}) => this._append(detail));
    this.addEventListener(TodoRemoveRequested, ({ detail}) => this._remove(detail));
  }

  private _refresh() {
    const todos = this.data.filter((todo) =>
      this._filterState.value === 'all'
        ? true
        : this._filterState.value === 'completed'
          ? todo.completed
          : !todo.completed,
    );
    this._checkAllController.listView.set(todos);
    this._checkAllController.syncCheckAll();
  }

  private _append(title: string) {
    const todo: Todo = { title, completed: false };
    this.data.push(todo);
    if (this._filterState.value !== 'completed') {
      this._checkAllController.listView.append(todo);
      this._checkAllController.syncCheckAll();
    }
  }

  private _remove(todo: Todo) {
    this.data.splice(this.data.indexOf(todo), 1);
    this._checkAllController.syncCheckAll();
  }
}

export function todo() {
  const todos: Todo[] = [
    { title: 'Coding', completed: false },
    { title: 'Dinner', completed: true },
    { title: 'Test', completed: false },
  ];

  const todoPage = new TodoPage(todos);

  document.querySelector('#body')!.append(
    todoPage.render()
  );
}