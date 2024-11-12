import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session10Page } from './Session10Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session10RenderHandler: RenderHandlerType<typeof Session10Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
