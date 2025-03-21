import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
    ): User {
        return this.userService.createUser(name, email, password);
    }

    @Get()
    getAllUsers(): User[] {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string): User {
    return this.userService.getUserById(id);
    }

    @Put(':id')
    updateUser(
        @Param('id') id: string,
        @Body('name') name?: string,
        @Body('email') email?: string,
        @Body('password') password?: string
    ): User {
        return this.userService.updateUser(id, name, email, password);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string): { message: string } {
        const deleted = this.userService.deleteUser(id);

        if (deleted) {
            return { message: 'User deleted successfully' };
        }
    }
}