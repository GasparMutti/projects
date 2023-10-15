import colors from "colors";

export class CustomizedError extends Error {
  constructor({name, message, status, originalErr}) {
    super();
    this.name = name;
    this.message = message;
    this.status = status;
    this.originalErr = originalErr;
  }
}

export default function errorHandler(err, req, res, next) {
  console.log(
    colors.red(
      `Fatal error at moment of ${req.method} in ${
        req.url
      } at ${new Date().toLocaleString()}`
    )
  );
  console.log(err);
  if (err instanceof CustomizedError) {
    const errorResponse = {
      status: err?.status || 500,
      message:
        err?.message || "Unexpected server error, we are working on fixing it.",
      payload: null,
    };
    return res.status(errorResponse.status).json(errorResponse);
  }

  return res.status(500).json({
    status: 500,
    message: "Unexpected server error, we are working on fixing it.",
    payload: null,
  });
}

export function handleError(err) {
  if (err instanceof CustomizedError) return err;
  return new CustomizedError({
    name: "ControllerError",
    message: "Unexpected server error, we are working on fixing it.",
    status: 500,
    originalErr: err,
  });
}
