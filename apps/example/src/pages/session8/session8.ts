import {CustomEventWithDetail, html, View} from "rune-ts";
import {SwitchView, Toggled} from "./ui/SwichView";

const log = console.log;

// https://developer.apple.com/documentation/uikit/uiswitch

interface Setting {
  title: string;
  on: boolean;
}

class SettingItemView extends View<Setting> {
  switchView = new SwitchView(this.data);

  override template() {
    return html`
      <div>
        <span class="title">${this.data.title}</span>
        ${this.switchView}
      </div>
    `;
  }
}

class SettingListView extends View<Setting[]> {
  itemViews = this.data.map(setting => new SettingItemView(setting));

  override template() {
    return html`
      <div>
        ${this.itemViews}
      </div>
    `;
  }
}

class SettingPage extends View<Setting[]> {
  private _checkAllView = new SwitchView({ on: false });
  private _listView = new SettingListView(this.data);

  override template() {
    return html`
      <div>
        <div class="header">
          <h2>Setting</h2>
          ${this._checkAllView}
        </div>
        <div class="body">
          ${this._listView}
        </div>
      </div>
    `;
  }

  protected override onRender() {
    this._checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this._listView.addEventListener(Toggled, () => this._syncCheckAll());
  }

  private _checkAll(on: boolean) {
    this._listView.itemViews
      .filter((view) => view.data.on !== on)
      .forEach(view => view.switchView.setOn(on));
  }

  private _syncCheckAll() {
    this._checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this._listView.itemViews.every(view => view.data.on);
  }
}

export async function main() {
  const settings: Setting[] = [
    { title: 'Wifi', on: true },
    { title: 'Bluetooth', on: false },
    { title: 'AirDrop', on: false },
  ];

  document.querySelector('#body')!.append(
    new SettingPage(settings).render()
  );

}



