import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../auth.service";
import { UserDto } from "../dto/user.dto";
import { verify } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";


declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDto;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private configService: ConfigService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(" ")[1];
    const decode: any = verify(token, this.configService.get("JWT_SECRET"));
    const user: UserDto = await this.authService.findOne(decode.id);
    if (!user) {
      res.status(401).send({ error: "Please Authorize Yourself" });
    }
    req.currentUser = user;
    next();
  }
}
