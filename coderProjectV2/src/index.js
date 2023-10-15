import app from "./app.js";
import config from "./config/index.js";
import colors from "colors";

app.listen(config.PORT, () =>
  console.log(
    colors.yellow(
      `Server listen on port: ${config.PORT} - http://localhost:${config.PORT} \n`
    )
  )
);
