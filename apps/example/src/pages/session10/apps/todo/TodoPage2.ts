import {html, View} from "rune-ts";
import {CheckView} from "../../ui/CheckView";
import {Toggled} from "../../ui/Toggled";
import {CheckListController} from "../../ui/CheckListController";
import {SegmentControlView, SegmentSelected} from "../../ui/SegmentControlView";
import {InputTextReturned, InputTextReturnEnterView} from "../../ui/InputTextReturnEnterView";
import type {Todo} from "./Todo";
import {TodoRemoveRequested} from "./TodoRemoveRequested";
import {TodoListView} from "./TodoListView";

interface FilterState {
  title: string;
  predicate: (todo: Todo) => boolean;
}

class TodoPage extends View<Todo[]> {
  private _checkAllController = new CheckListController(
    new CheckView(),
    new TodoListView([...this.data]),
    (itemView) => itemView.data.completed,
    (itemView, bool) => itemView.setCompleted(bool)
  );

  private _filterStates: FilterState[] = [
    { title: 'All', predicate: () => true },
    { title: 'Active', predicate: todo => !todo.completed },
    { title: 'Completed', predicate: todo => todo.completed }
  ];

  private _filterView = new SegmentControlView(this._filterStates);

  addFilterState(filterState: FilterState) {
    this._filterStates.push(filterState);
    this._filterView.append(filterState);
  }

  private get _filterState(): FilterState {
    return this._filterStates[this._filterView.selectedIndex];
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
    const todos = this.data.filter(this._filterState.predicate);
    this._checkAllController.listView.set(todos);
    this._checkAllController.syncCheckAll();
  }

  private _append(title: string) {
    const todo: Todo = { title, completed: false };
    this.data.push(todo);
    if (this._filterState.predicate(todo)) {
      this._checkAllController.listView.append(todo);
      this._checkAllController.syncCheckAll();
    }
  }

  private _remove(todo: Todo) {
    this.data.splice(this.data.indexOf(todo), 1);
    this._checkAllController.syncCheckAll();
  }
}

export function todo2() {
  const todos: Todo[] = [
    { title: 'Coding', completed: false },
    { title: 'Dinner', completed: true },
    { title: 'Test', completed: false },
  ];

  const todoPage = new TodoPage(todos);
  // window.todoPage = todoPage;

  document.querySelector('#body')!.append(
    todoPage.render()
  );
}