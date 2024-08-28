import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session2Page } from './Session2Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session2RenderHandler: RenderHandlerType<typeof Session2Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
