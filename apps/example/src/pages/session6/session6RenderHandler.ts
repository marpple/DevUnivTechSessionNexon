import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session6Page } from './Session6Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session6RenderHandler: RenderHandlerType<typeof Session6Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
