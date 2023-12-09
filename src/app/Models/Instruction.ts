import { OperationInstruction } from "../Enums/OperationInstruction";
import { VariableInstruction } from "../Enums/InstructionVariable";

export class Instruction {
  operacion: OperationInstruction | undefined;
  operando1: number | VariableInstruction | undefined;
  operando2: number | VariableInstruction | undefined;
  operando3: VariableInstruction | undefined;
  textoInstruccion: string;

  constructor(textoInstruccion: string) {
    this.textoInstruccion = textoInstruccion;
    this.BreakInstruction();
  }

  BreakInstruction(): void {
    let instruccionArray = this.textoInstruccion.split(" ");
    this.operacion = this.GetOperation(instruccionArray[0]);
    this.operando1 = this.GetOperand(instruccionArray[1]);
    this.operando2 = this.GetOperand(instruccionArray[2]);
    this.operando3 = this.GetOperand(instruccionArray[3]);
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
        alert("Operando Inválido");
        return undefined;
    }
  }

  GetOperand(operando: string): number | VariableInstruction | undefined {
    if (operando == undefined) {
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
    return this.textoInstruccion;
  }
}
