import colors from "colors";

export default function appLogger(req, res, next) {
  console.log(
    `${colors.yellow(req.method)} on ${
      req.url
    } at ${new Date().toLocaleString()}`
  );
  next();
}
