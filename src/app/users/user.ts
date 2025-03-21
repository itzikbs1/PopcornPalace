export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(id: string, name: string, email: string, password: string, createdAt?: Date, updatedAt?: Date) { 
    // if (!name || name.trim().length === 0) {
    //     throw new Error("Name is required");
    //   }
  
    //   if (!User.isValidEmail(email)) {
    //     throw new Error("Invalid email format");
    //   }
  
    //   if (password.length < 6) {
    //     throw new Error("Password must be at least 6 characters long");
    //   }
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt || new Date();
    }

    // static isValidEmail(email: string): boolean {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    //   }
  }