import type { Request, Response, NextFunction } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Wraps an async Express route handler with standardized error handling.
 * Catches thrown errors, logs them, and returns a 500 JSON response.
 */
export function asyncHandler(
  handler: AsyncRouteHandler,
  errorMessage: string
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    handler(req, res, next).catch((error: unknown) => {
      console.error(errorMessage, error);
      res.status(500).json({ error: errorMessage });
    });
  };
}
