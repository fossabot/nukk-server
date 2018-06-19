import winston from 'winston';
import LOGGER_CONFIG from '../../config/logger.config.json';

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: this.buildLoggers(),
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    }
    return this.logger;
  }
  /**
   * Construye los archivos dónde van a escribirse los lods a partir de la configuración
   * @returns Array
   * @memberof Logger
   */
  buildLoggers() {
    const { loggers } = LOGGER_CONFIG;
    const transports = [];
    loggers.forEach((logger) => {
      if (logger.disabled || logger.global) return;
      const fileConfig = {
        filename: `logs/${logger.file}`,
        level: logger.level,
      };
      transports.push(new winston.transports.File(fileConfig));
    });
    return transports;
  }

  rebuild() {
    return new this();
  }
}

// @Singleton
module.exports = new Logger();