// src/models/User.ts
export interface User {
    id: string;
    username: string;
    password: string;
    status: 'active' | 'inactive';
  }
  