import { OperationInstruction } from "../Enums/OperationInstruction";
import { VariableInstruction } from "../Enums/InstructionVariable";

export class Instruction {
  operation: OperationInstruction | undefined;
  eperand1: number | VariableInstruction | undefined;
  operand2: number | VariableInstruction | undefined;
  operand3: VariableInstruction | undefined;
  instructionText: string;
  error : string = "";

  constructor(textoInstruccion: string) {
    this.instructionText = textoInstruccion;
    this.LoadInstruction();
  }

  LoadInstruction(): void {
    let instruccionArray = this.instructionText.split(" ");
    this.operation = this.GetOperation(instruccionArray[0]);
    this.eperand1 = this.GetOperand(instruccionArray[1]);
    this.operand2 = this.GetOperand(instruccionArray[2]);
    this.operand3 = this.GetOperand(instruccionArray[3]);
  }

  GetOperation(operacion: string): OperationInstruction | undefined {
    switch (operacion.toUpperCase()) {
      case "LOAD":
        return OperationInstruction.LOAD;
      case "MUL":
        return OperationInstruction.MUL;
      case "ADD":
        return OperationInstruction.ADD;
      case "SUB":
        return OperationInstruction.SUB;
      case "DIV":
        return OperationInstruction.DIV;
      case "MOVE":
        return OperationInstruction.MOVE;
      default:
        this.error = "operando no válido"
        return;
    }
  }

  GetOperand(operando: string): number | VariableInstruction | undefined {
    if (operando == undefined) {
      this.error = " operando inválido"
      return undefined;
    }
    switch (operando.toUpperCase()) {
      case "A":
        return VariableInstruction.A;
      case "B":
        return VariableInstruction.B;
      case "C":
        return VariableInstruction.C;
      case "D":
        return VariableInstruction.D;
      case "E":
        return VariableInstruction.E;
      case "F":
        return VariableInstruction.F;
      case "G":
        return VariableInstruction.G;
      case "H":
        return VariableInstruction.H;
      default:
        return Number(operando);
    }
  }

  toString(): string {
    return this.instructionText;
  }
}
