import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session5Page } from './Session5Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session5RenderHandler: RenderHandlerType<typeof Session5Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
