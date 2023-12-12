import { OperationInstruction } from "../Enums/OperationInstruction";

export class ALU {
  operacionAEjecutar: OperationInstruction | undefined;
  operando1: number = 0;
  operando2: number = 0;
  error : string = '';

  RunOperation(tipoOperacion: OperationInstruction, operando1: number, operando2: number): number {
    this.operacionAEjecutar = tipoOperacion;
    this.operando1 = operando1;
    this.operando2 = operando2;

    switch (this.operacionAEjecutar) {
      case OperationInstruction.ADD:
        return this.add(operando1, operando2);
      case OperationInstruction.SUB:
        return this.sub(operando1, operando2);
      case OperationInstruction.MUL:
        return this.multiply(operando1, operando2);
      case OperationInstruction.DIV:
        return this.divide(operando1, operando2);
      default:
        this.error = "Operación no válida";
        return 0;
    }
  }

  private add(operando1: number, operando2: number): number {
    return operando1 + operando2;
  }

  private sub(operando1: number, operando2: number): number {
    return operando1 - operando2;
  }

  private multiply(operando1: number, operando2: number): number {
    return operando1 * operando2;
  }

  private divide(operando1: number, operando2: number): number  {
    if(operando2 == 0){
      this.error = "Error en la operación"
      throw new Error("Error en la operación")
    }
    try {
      return operando1 / operando2;
    } catch (error) {
      this.error = "Error en operación"
      return 0;
    }
  }
}
