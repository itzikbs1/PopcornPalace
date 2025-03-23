import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, User } from '@prisma/client';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {
    constructor(private readonly database: DatabaseService) {}

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const { name, email, password } = data;

        // Validate name
        if (!name || name.trim().length === 0) {
            throw new BadRequestException('Name is required');
        }

        // Validate email
        if (!email || !this.isValidEmail(email)) {
            throw new BadRequestException('Invalid email format');
        }

        // Check if email already exists
        const existingUser = await this.database.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Validate password length
        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        try {
            return await this.database.user.create({ data });
        } catch (error) {
            throw new BadRequestException('Error creating user: ' + error.message);
        }
    }

    async getUserById(id: string): Promise<User> {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const user = await this.database.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('Invalid email format');
        }

        const user = await this.database.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with email "${email}" not found`);
        }
        return user;
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const existingUser = await this.database.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        try {
            return await this.database.user.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw new BadRequestException('Error updating user: ' + error.message);
        }
    }

    async deleteUser(id: string): Promise<void> {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const existingUser = await this.database.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        try {
            await this.database.user.delete({ where: { id } });
        } catch (error) {
            throw new BadRequestException('Error deleting user: ' + error.message);
        }
    }
}
