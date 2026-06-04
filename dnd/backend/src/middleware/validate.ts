import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware that validates required fields exist in req.body.
 * Returns 400 with a descriptive error if any field is missing/falsy.
 */
export function requireBody(...fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (!req.body[field]) {
        res.status(400).json({ error: `${capitalize(field)} is required` });
        return;
      }
    }
    next();
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
