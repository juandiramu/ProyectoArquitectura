import { Instruction } from "./Instruction";

export class Memory {
  positions: Array<Instruction> = new Array<Instruction>();

  AddInstruction(instruccion: string) {
    this.positions.push(new Instruction(instruccion));
  }

  GetInstruction(direccion: number): Instruction | undefined {
    return this.positions[direccion];
  }
}
