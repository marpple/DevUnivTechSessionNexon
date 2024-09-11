import { type LayoutData, MetaView } from '@rune-ts/server';
import type { Session4Page } from './Session4Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const session4RenderHandler: RenderHandlerType<typeof Session4Page> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
