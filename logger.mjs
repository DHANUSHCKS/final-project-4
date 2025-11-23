import winston from 'winston';

export const createLogger = (serviceName = 'service') => {
  const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: serviceName },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()]
  });

  return logger;
};
