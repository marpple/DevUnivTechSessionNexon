import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session3Page } from './Session3Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session3RenderHandler: RenderHandlerType<typeof Session3Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
