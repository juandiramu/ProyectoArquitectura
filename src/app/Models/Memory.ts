import { Instruction } from "./Instruction";

export class Memory {
  celdas: Array<Instruction> = new Array<Instruction>();

  AddInstruction(instruccion: string) {
    this.celdas.push(new Instruction(instruccion));
  }

  GetInstruction(direccion: number): Instruction | undefined {
    return this.celdas[direccion];
  }
}
