import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() userData: Prisma.UserCreateInput) {
        return this.userService.createUser(userData);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        return this.userService.getUserByEmail(email);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() userData: Prisma.UserUpdateInput) {
        return this.userService.updateUser(id, userData);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
