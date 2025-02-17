import {createLogger, format, transports} from 'winston';

const {timestamp, combine, printf, colorize, splat, align} = format;
const {Console} = transports;

export const logger = createLogger({
  transports: [new Console()],
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize({all: true}),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    align(),
    splat(),
    printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  defaultMeta: {service: 'printsyou-frontend'}
});
