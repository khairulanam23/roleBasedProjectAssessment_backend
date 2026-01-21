import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const status = res.statusCode;
    const user = (req as any).user ? (req as any).user.id : "anonymous";

    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} ${status} ${duration}ms - user: ${user} - ip: ${ip}`,
    );
  });

  next();
};

export default loggerMiddleware;
