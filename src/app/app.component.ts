import { Component } from '@angular/core';
import { Instruction } from './Models/Instruction';
import { ALU } from './Models/alu';
import { Memory } from './Models/Memory';
import { GeneralVariables } from './Models/GeneralVariables';
import { ProcessorElements } from './Enums/Elements';
import { ExecuteTaskService } from './Services/EecuteTaskService';
import { States } from './Enums/States';
import { OperationInstruction } from './Enums/OperationInstruction';
import { VariableInstruction } from './Enums/InstructionVariable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  // Elementos de la interfaz
  instruccionesIntroducidas: string = '';
  elementoActivo: ProcessorElements;
  estadoComputador: States;

  // Elementos del procesador
  PC: number = 0;
  MAR: number = 0;
  MBR: Instruction | undefined;
  IR: Instruction | undefined;
  ALU: ALU = new ALU();
  memoria: Memory = new Memory();
  bancoRegistros: GeneralVariables = new GeneralVariables();

  constructor(private ejecutarTareaService: ExecuteTaskService) {
    this.estadoComputador = States.SIN_INICIAR;
    this.elementoActivo = ProcessorElements.UNIDAD_CONTROL;
  }

  LoadAndRunInstructions() {
    this.estadoComputador = States.EN_EJECUCION;
    this.AddInstructionInMemory();
    this.ExecuteSavedInstructions();
  }

  private AddInstructionInMemory() {
    this.memoria = new Memory();
    let instruccionesArray = this.instruccionesIntroducidas.split('\n');
    instruccionesArray.forEach((instruccion) => {
      this.memoria.AddInstruction(instruccion);
    });
  }

  private LineToExecute() {
    return this.PC < this.memoria.celdas.length;
  }

  private async ExecuteSavedInstructions() {
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.PC;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.MAR;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.MAR = this.PC;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.BUS_DIRECCIONES;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.MEMORIA;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.BUS_DATOS;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.MBR;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.MBR = this.memoria.GetInstruction(this.PC);
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.IR;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.IR = this.MBR;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.UNIDAD_CONTROL;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(async () => {
      await this.ExecuteInstruction();
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.UNIDAD_CONTROL;
    })
    if (this.LineToExecute()) {
      this.PC++;
      this.ExecuteSavedInstructions();
    }
  }

  private async ExecuteInstruction(): Promise<void> {
    if (this.IR == undefined) {
      return;
    }
    const operacion = this.IR.operacion;
    const operando1: number | VariableInstruction | undefined = this.IR.operando1;
    const operando2: number | VariableInstruction | undefined = this.IR.operando2;
    const operando3: number | VariableInstruction | undefined = this.IR.operando3;

    switch (operacion) {
      case OperationInstruction.LOAD:
        await this.LoadInstruction(operando1, operando2);
        break;
      case OperationInstruction.ADD:
        await this.MathInstruction(OperationInstruction.ADD, operando1, operando2, operando3);
        break;
      case OperationInstruction.SUB:
        await this.MathInstruction(OperationInstruction.SUB, operando1, operando2, operando3);
        break;
      case OperationInstruction.MUL:
        await this.MathInstruction(OperationInstruction.MUL, operando1, operando2, operando3);
        break;
      case OperationInstruction.DIV:
        await this.MathInstruction(OperationInstruction.DIV, operando1, operando2, operando3);
        break;
      case OperationInstruction.MOVE:
        await this.MoveInstruction(operando1, operando2);
        break;
      default:
        break;
    }
  }


  // Ejecucion de instrucciones
  // -------------------------------
  // -------------------------------
  // -------------------------------
  // -------------------------------
  private async LoadInstruction(variableAGuardar: number | VariableInstruction | undefined, numero: number | VariableInstruction | undefined): Promise<void> {
    if (variableAGuardar == undefined || numero == undefined) {
      return;
    }
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.BANCO_REGISTROS;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      switch(variableAGuardar) {
        case VariableInstruction.A:
          this.bancoRegistros.A = numero;
          break;
        case VariableInstruction.B:
          this.bancoRegistros.B = numero;
          break;
        case VariableInstruction.C:
          this.bancoRegistros.C = numero;
          break;
        case VariableInstruction.D:
          this.bancoRegistros.D = numero;
          break;
        case VariableInstruction.E:
          this.bancoRegistros.E = numero;
          break;
        case VariableInstruction.F:
          this.bancoRegistros.F = numero;
          break;
        case VariableInstruction.G:
          this.bancoRegistros.G = numero;
          break;
        case VariableInstruction.H:
          this.bancoRegistros.H = numero;
          break;
        default:
          break;
      }
    })
  }

  private async MathInstruction(tipoOperacion: OperationInstruction, primeraVariable: number | VariableInstruction | undefined, segundaVariable: number | VariableInstruction | undefined, variableDestino: number | VariableInstruction | undefined): Promise<void> {
    if (primeraVariable == undefined || segundaVariable == undefined) {
      return;
    }
    switch(variableDestino) {
      case VariableInstruction.A:
        this.bancoRegistros.A = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.B:
        this.bancoRegistros.B = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.C:
        this.bancoRegistros.C = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.D:
        this.bancoRegistros.D = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.E:
        this.bancoRegistros.E = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.F:
        this.bancoRegistros.F = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.G:
        this.bancoRegistros.G = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.H:
        this.bancoRegistros.H = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      default:
        break;
    }
  }

  private async AluInstruction(operacion: OperationInstruction, operando1: number | VariableInstruction | undefined, operando2: number | VariableInstruction | undefined): Promise<number> {
    if (operando1 == undefined || operando2 == undefined) {
      return 0;
    }
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.ALU;
    })
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.BANCO_REGISTROS;
    })
    const numero1 = this.GetRegisterBank(operando1);
    const numero2 = this.GetRegisterBank(operando2);
    const resultadoOperacion = this.ALU.RunOperation(operacion, numero1, numero2);
    return resultadoOperacion;
  }

  private GetRegisterBank(variableAObtener: number | VariableInstruction | undefined) {
    if (variableAObtener == undefined) {
      return 0;
    }
    switch(variableAObtener) {
      case VariableInstruction.A:
        return this.bancoRegistros.A;
      case VariableInstruction.B:
        return this.bancoRegistros.B;
      case VariableInstruction.C:
        return this.bancoRegistros.C;
      case VariableInstruction.D:
        return this.bancoRegistros.D;
      case VariableInstruction.E:
        return this.bancoRegistros.E;
      case VariableInstruction.F:
        return this.bancoRegistros.F;
      case VariableInstruction.G:
        return this.bancoRegistros.G;
      case VariableInstruction.H:
        return this.bancoRegistros.H;
      default:
        return 0;
    }
  }

  private async MoveInstruction(variableOrigen: number | VariableInstruction | undefined, variableDestino: number | VariableInstruction | undefined): Promise<void> {
    if (variableOrigen == undefined || variableDestino == undefined) {
      return;
    }
    await this.ejecutarTareaService.ExecuteTaskAfterTime(() => {
      this.elementoActivo = ProcessorElements.BANCO_REGISTROS;
    })
    switch(variableDestino) {
      case VariableInstruction.A:
        this.bancoRegistros.A = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.B:
        this.bancoRegistros.B = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.C:
        this.bancoRegistros.C = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.D:
        this.bancoRegistros.D = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.E:
        this.bancoRegistros.E = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.F:
        this.bancoRegistros.F = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.G:
        this.bancoRegistros.G = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.H:
        this.bancoRegistros.H = this.GetRegisterBank(variableOrigen);
        break;
      default:
        break;
    }
  }



  // Getters de estado de la interfaz
  // -------------------------------
  // -------------------------------
  // -------------------------------
  // -------------------------------
  get habilitarBtnEjecutar(): boolean {
    return this.estadoComputador == States.SIN_INICIAR;
  }

  get habilitarBtnPausar(): boolean {
    return this.estadoComputador == States.EN_EJECUCION;
  }

  get habilitarBtnReanudar(): boolean {
    return this.estadoComputador == States.PAUSADO;
  }

  get unidadControlEstaActiva(): boolean {
    return this.elementoActivo == ProcessorElements.UNIDAD_CONTROL;
  }

  get memoriaEstaActiva(): boolean {
    return this.elementoActivo == ProcessorElements.MEMORIA;
  }

  get aluEstaActiva(): boolean {
    return this.elementoActivo == ProcessorElements.ALU;
  }

  get almacenGeneralEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.BANCO_REGISTROS;
  }

  get pcEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.PC;
  }

  get marEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.MAR;
  }

  get mbrEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.MBR;
  }

  get irEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.IR;
  }

  get busDatosEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.BUS_DATOS;
  }

  get busDireccionesEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.BUS_DIRECCIONES;
  }

  get busControlEstaActivo(): boolean {
    return this.elementoActivo == ProcessorElements.BUS_CONTROL;
  }
}
