export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(id: string, name: string, email: string, password: string, createdAt?: Date, updatedAt?: Date) { 
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt || new Date();
    }
  }