// src/models/Operation.ts
export interface Operation {
    id: string;
    type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'square_root' | 'random_string';
    cost: number;
  }
  