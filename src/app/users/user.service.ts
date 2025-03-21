import { Injectable, BadRequestException, NotFoundException  } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import { User } from "./user";
import { isValidEmail } from "src/utils/validation";

@Injectable()
export class UserService {
    private users: User[] = [
        new User(uuidv4(), "John Doe", "john.doe@example.com", "password123"),
        new User(uuidv4(), "Jane Smith", "jane.smith@example.com", "securePass456"),
        new User(uuidv4(), "Alice Johnson", "alice.j@example.com", "AlicePass789"),
    ];

    createUser(name: string, email: string, password: string): User {
        if (!name || name.trim().length === 0) {
            throw new BadRequestException('Name is required');
        }
        if (!email || email.trim().length === 0) {
            throw new BadRequestException('Email is required');
        }
        if (!isValidEmail(email)) {
            throw new BadRequestException("Invalid email format");
        }
        if (this.users.find(user => user.email === email)) {
            throw new BadRequestException('Email already exists');
        }
        if (password.length < 6) {
            throw new BadRequestException("Password must be at least 6 characters long");
        } 

        const newUser = new User(uuidv4(), name, email, password);
        this.users.push(newUser);

        return newUser;
    }

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        const user = this.users.find(user => user.id === id);
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;    
    }

    updateUser(id: string, name?: string, email?: string, password?: string): User | null {
        const user = this.getUserById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (name) user.name = name;
        if (email) {
            if (!isValidEmail(email)) {
                throw new BadRequestException('Invalid email format');
            }
            if (this.users.find(user => user.email === email)) {
                throw new BadRequestException('Email already in use');
            }
            user.email = email;
        } 
        if (password) {
            if (password.length < 6) {
                throw new BadRequestException('Password must be at least 6 characters long');
            }
            user.password = password;
        } 
    
        user.updatedAt = new Date();
        return user;
    }

    deleteUser(id: string) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) {
            throw new NotFoundException('User not found');
        }
    
        this.users.splice(index, 1);
        return true;
    }
}