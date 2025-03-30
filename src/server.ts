import app from "./app";
import { ENV } from "./config/env";
import logger from "./utils/logger";

const startServer = async () => {
  app.listen(ENV.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
};

startServer();
