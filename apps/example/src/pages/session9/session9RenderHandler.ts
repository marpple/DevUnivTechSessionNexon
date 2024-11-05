import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session9Page } from './Session9Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session9RenderHandler: RenderHandlerType<typeof Session9Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
