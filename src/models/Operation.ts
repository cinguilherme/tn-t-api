// src/models/Operation.ts
export interface Operation {
  id: string;
  type:
    | "addition"
    | "subtraction"
    | "multiplication"
    | "division"
    | "square_root"
    | "random_string";
  cost: number;
}

export const getOperationCost = (type: string): number => {
  switch (type) {
    case "addition":
      return 10;
    case "subtraction":
      return 10;
    case "multiplication":
      return 20;
    case "division":
      return 20;
    case "square_root":
      return 30;
    case "random_string":
      return 50;
    default:
      throw new Error("Invalid operation type");
  }
};
