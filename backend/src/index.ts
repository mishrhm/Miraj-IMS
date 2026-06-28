import { log } from "node:console";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      log(
        `🚀 Miraj-IMS Backend Running Engine Active on: http://localhost:${PORT}`,
      );
      log(`🟢 Health monitor point live at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to bind HTTP server socket listener:", error);
    process.exit(1);
  }
}

startServer();
