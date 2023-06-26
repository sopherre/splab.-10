import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { CredentialsDto } from "./dto/credentials.dto";
import * as bycrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private _jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this._userRepository.createUser(createUserDto);
  }

  async signIn(
    credentialsDto: CredentialsDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = credentialsDto;
    const user = await this._userRepository.findOne({ username });

    if (user && (await bycrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: user.username };
      const accessToken = await this._jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException(
      "ユーザー名またはパスワードを確認してください。"
    );
  }
}
