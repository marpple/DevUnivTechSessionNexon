import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session7Page } from './Session7Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session7RenderHandler: RenderHandlerType<typeof Session7Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
