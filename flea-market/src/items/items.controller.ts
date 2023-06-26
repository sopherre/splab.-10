import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { Item } from "../entities/item.entity";
import { ItemsService } from "./items.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { User } from "../entities/user.entity";
import { Role } from "../auth/decorator/role.decorator";
import { UserStatus } from "../auth/user-status.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("items")
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private readonly _itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return await this._itemsService.findAll();
  }

  @Get(":id") // /items/id
  async findById(@Param("id", ParseUUIDPipe) id: string): Promise<Item> {
    return await this._itemsService.findById(id);
  }

  @Post()
  @Role(UserStatus.PREMIUM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User
  ): Promise<Item> {
    return await this._itemsService.create(createItemDto, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<Item> {
    return await this._itemsService.updateStatus(id, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<void> {
    await this._itemsService.delete(id, user);
  }
}
