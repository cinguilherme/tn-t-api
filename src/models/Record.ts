// src/models/Record.ts
export interface Record {
    id: string;
    operation_id: string;
    user_id: string;
    amount: number;
    user_balance: number;
    operation_desc: string;
    operation_inputs: any[];
    operation_response: string;
    date: string;
  }
  