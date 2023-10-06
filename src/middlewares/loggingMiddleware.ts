import { NextFunction, Response, Request } from "express";

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default loggingMiddleware;
