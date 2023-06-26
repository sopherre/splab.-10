import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "../entities/user.entity";
import { AuthService } from "./auth.service";
import { CredentialsDto } from "./dto/credentials.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this._authService.signUp(createUserDto);
  }

  @Post("signin")
  async signIn(
    @Body() credentialsDto: CredentialsDto
  ): Promise<{ accessToken: string }> {
    return await this._authService.signIn(credentialsDto);
  }
}
