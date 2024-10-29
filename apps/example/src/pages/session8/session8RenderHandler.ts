import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session8Page } from './Session8Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session8RenderHandler: RenderHandlerType<typeof Session8Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
