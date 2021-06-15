import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth/authService";
import { BadRequest, HttpError } from "../util/httpError";
import { User } from "../entity/user";
import { bodyEmpty } from "../util/util";

export class AuthController {
  //   private userRepository = getRepository(User);

  //   private userService: UserService = new UserService(this.userRepository);
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    if (bodyEmpty(req)) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "body empty",
      });
    }

    const newUser = new User();

    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.password = req.body.password;
    newUser.photoUrl = null;
    newUser.firebaseUuid = null;

    try {
      const authService = new AuthService();
      const user = await authService.register(newUser);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        // return res.status(err.statusCode).send({
        //   status: "error",
        //   message: err.message || `error registering new user`,
        // });
        return next(err)
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error registering new user`,
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    if (bodyEmpty(req)) {
      return res.status(400).send({
        status: "error",
        message: "request body cannot be empty",
      });
    }

    const { email, password } = req.body;

    try {
      const authService = new AuthService();
      const user = await authService.login(email, password);

      return res.send({
        status: "success",
        message: "login successful",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).send({
          status: "error",
          message: err.message || `error while trying to login user`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error while trying to login user`,
      });
    }
  }

  async firebaseRegister(req: Request, res: Response): Promise<Response> {
    if (bodyEmpty(req)) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "body empty",
      });
    }

    const newUser = new User();

    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.firebaseUuid = req.body.firebaseUuid;
    newUser.photoUrl = req.body.photoUrl;

    try {
      // const authService = new AuthService();
      const user = await this.authService.firebaseRegister(newUser);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).send({
          status: "error",
          message: err.message || `error registering new user`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error registering new user`,
      });
    }
  }

  async firebaseGetUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (bodyEmpty(req)) {
      // return next(new BadRequest("body cannot be empty"));
      return next(new HttpError("body cannot be empty", 400));
    }

    const firebaseUuid = req.body.firebaseUuid;

    try {
      // const authService = new AuthService();
      const user = await this.authService.getUser(firebaseUuid);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).send({
          status: "error",
          message: err.message || `error getting user`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error getting user`,
      });
    }
  }
}
