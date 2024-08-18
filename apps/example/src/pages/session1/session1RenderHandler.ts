import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session1Page } from './Session1Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session1RenderHandler: RenderHandlerType<typeof Session1Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
