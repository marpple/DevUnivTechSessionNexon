import { app } from '@rune-ts/server';
import type { LayoutData } from '@rune-ts/server';
import UAParser from 'ua-parser-js';
import favicon from '../../../public/favicon.png';
import { ClientRouter } from '../route';
import { session1RenderHandler } from '../../pages/session1/session1RenderHandler';
import { session2RenderHandler } from "../../pages/session2/session2RenderHandler";
import { session3RenderHandler } from "../../pages/session3/session3RenderHandler";
import { session4RenderHandler } from "../../pages/session4/session4RenderHandler";
import { session5RenderHandler } from "../../pages/session5/session5RenderHandler";
import { session6RenderHandler } from "../../pages/session6/session6RenderHandler";
import { session7RenderHandler } from "../../pages/session7/session7RenderHandler";
import { session8RenderHandler } from "../../pages/session8/session8RenderHandler";
import { session9RenderHandler } from "../../pages/session9/session9RenderHandler";

const server = app();
server.use((req, res, next) => {
  const ua_string = req.headers['user-agent'];
  const parser = new UAParser(ua_string);
  res.locals.is_mobile = !!parser.getDevice().type;

  res.locals.layoutData = {
    html: {
      is_mobile: res.locals.is_mobile,
    },
    head: {
      title: '',
      description: '',
      link_tags: [
        {
          rel: 'icon',
          href: favicon,
          type: 'image/png',
        },
      ],
    },
  } as LayoutData;

  return next();
});

server.get(ClientRouter['/session1'].toString(), session1RenderHandler(ClientRouter['/session1']));

server.get(ClientRouter['/session2'].toString(), session2RenderHandler(ClientRouter['/session2']));

server.get(ClientRouter['/session3'].toString(), session3RenderHandler(ClientRouter['/session3']));

server.get(ClientRouter['/session4'].toString(), session4RenderHandler(ClientRouter['/session4']));

server.get(ClientRouter['/session5'].toString(), session5RenderHandler(ClientRouter['/session5']));

server.get(ClientRouter['/session6'].toString(), session6RenderHandler(ClientRouter['/session6']));

server.get(ClientRouter['/session7'].toString(), session7RenderHandler(ClientRouter['/session7']));

server.get(ClientRouter['/session8'].toString(), session8RenderHandler(ClientRouter['/session8']));

server.get(ClientRouter['/session9'].toString(), session9RenderHandler(ClientRouter['/session9']));
