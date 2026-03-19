import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function validateDto(dtoClass: any): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    const errors = await validate(output);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      );
      res.status(400).json({ 
        error: 'Bad Request', 
        messages: errorMessages 
      });
      return;
    }

    req.body = output;
    next();
  };
}