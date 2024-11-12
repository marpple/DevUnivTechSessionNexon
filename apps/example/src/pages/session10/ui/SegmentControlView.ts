import { CustomEventWithDetail, html, ListView, on, View } from 'rune-ts';

interface Segment {
  title: string;
  value?: string;
  selected?: boolean;
}

export class SegmentSelected extends CustomEventWithDetail<Segment> {}

class SegmentItemView extends View<Segment> {
  override template({ selected, title }: Segment) {
    return html`
      <button class="${selected ? 'selected' : ''}">${title}</button>
    `;
  }
}

export class SegmentControlView extends ListView<Segment, SegmentItemView> {
  ItemView = SegmentItemView;

  selectedIndex: number;

  constructor(data: Segment[]) {
    super(data);
    this.selectedIndex = Math.max(0, this.data.findIndex((segment) => segment.selected));
    this.data[this.selectedIndex].selected = true;
  }

  override onRender() {
    this.delegate('click', SegmentItemView, (e, itemView) => {
      if (itemView.data === this.selectedSegment()) return;
      itemView.element().classList.add('selected');
      itemView.data.selected = true;
      this._selectedSegmentView().element().classList.remove('selected');
      this._selectedSegmentView().data.selected = false;
      this.selectedIndex = this.itemViews.indexOf(itemView);
      this.dispatchEvent(SegmentSelected, { detail: this.selectedSegment(), bubbles: true });
    })
  }

  selectedSegment() {
    return this.data[this.selectedIndex];
  }

  private _selectedSegmentView() {
    return this.itemViews[this.selectedIndex];
  }
}