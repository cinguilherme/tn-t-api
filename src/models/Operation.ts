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

export const performOperation = (
  operation: Operation,
  input1?: number,
  input2?: number
) => {
  switch (operation.type) {
    case "addition":
      return input1! + input2!;
    case "subtraction":
      return input1! - input2!;
    case "multiplication":
      return input1! * input2!;
    case "division":
      return input1! / input2!;
    case "square_root":
      return Math.sqrt(input1!);
    case "random_string":
      return Math.random().toString(36).substring(2, 15);
  }
};
