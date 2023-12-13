import { Component } from '@angular/core';
import { Instruction } from './Models/Instruction';
import { ALU } from './Models/alu';
import { Memory } from './Models/Memory';
import { RegisterBanck } from './Models/RegisterBanck';
import { ProcessorElements } from './Enums/Elements';
import { ExecuteTaskService } from './Services/EecuteTaskService';
import { States } from './Enums/States';
import { OperationInstruction } from './Enums/OperationInstruction';
import { VariableInstruction } from './Enums/InstructionVariable';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  addedInstructions: string = '';
  activeElement: ProcessorElements;
  computerState: States;
  error : string = 'Palabra Sistema'

  PC: number = 0;
  MAR: number = 0;
  MBR: Instruction | undefined;
  IR: Instruction | undefined;
  ALU: ALU = new ALU();
  memory: Memory = new Memory();
  registerBanck: RegisterBanck = new RegisterBanck();

  constructor(private executeTaskService: ExecuteTaskService) {
    this.computerState = States.SIN_INICIAR;
    this.activeElement = ProcessorElements.UNIDAD_CONTROL;
  }

  LoadAndRunInstructions() {
    this.computerState = States.EN_EJECUCION;
    this.AddInstructionInMemory();
    this.ExecuteSavedInstructions();
  }

  private AddInstructionInMemory() {
    this.memory = new Memory();
    let instruccionesArray = this.addedInstructions.split('\n');
    instruccionesArray.forEach((instruccion) => {
      this.memory.AddInstruction(instruccion);
    });
  }

  private LineToExecute() {
    return this.PC < this.memory.positions.length;
  }

  private async ExecuteSavedInstructions() {
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.PC;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.MAR;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.MAR = this.PC;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.BUS_DIRECCIONES;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.MEMORIA;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.BUS_DATOS;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.MBR;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.MBR = this.memory.GetInstruction(this.PC);
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.IR;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.IR = this.MBR;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.UNIDAD_CONTROL;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(async () => {
      await this.ExecuteInstruction();
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.UNIDAD_CONTROL;
    })
    if (this.LineToExecute()) {
      this.ExecuteSavedInstructions();
      this.PC++;
    }else{
      this.computerState = States.SIN_INICIAR;
    }
  }

  private async ExecuteInstruction(): Promise<void> {
    if (this.IR == undefined) {
      return;
    }
    const operacion = this.IR.operation;
    const operando1: number | VariableInstruction | undefined = this.IR.eperand1;
    const operando2: number | VariableInstruction | undefined = this.IR.operand2;
    const operando3: number | VariableInstruction | undefined = this.IR.operand3;

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
        this.error = "Operación incorrecta"
        break;
    }
  }

  private async LoadInstruction( numero: number | VariableInstruction | undefined, variableAGuardar: number | VariableInstruction | undefined): Promise<void> {
    if (variableAGuardar == undefined || numero == undefined) {
      this.error = "Variable no existe"
      return;
    }
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.BANCO_REGISTROS;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      switch(variableAGuardar) {
        case VariableInstruction.A:
          this.registerBanck.A = numero;
          break;
        case VariableInstruction.B:
          this.registerBanck.B = numero;
          break;
        case VariableInstruction.C:
          this.registerBanck.C = numero;
          break;
        case VariableInstruction.D:
          this.registerBanck.D = numero;
          break;
        case VariableInstruction.E:
          this.registerBanck.E = numero;
          break;
        case VariableInstruction.F:
          this.registerBanck.F = numero;
          break;
        case VariableInstruction.G:
          this.registerBanck.G = numero;
          break;
        case VariableInstruction.H:
          this.registerBanck.H = numero;
          break;
        default:
          this.error = "Variable no existe"
          break;
      }
    })
  }

  private async MathInstruction(tipoOperacion: OperationInstruction, primeraVariable: number | VariableInstruction | undefined, segundaVariable: number | VariableInstruction | undefined, variableDestino: number | VariableInstruction | undefined): Promise<void> {
    if (primeraVariable == undefined || segundaVariable == undefined) {
      this.error = "Variable no definida";
    }
    if(variableDestino == undefined){
      variableDestino = segundaVariable;
    }
    switch(variableDestino) {
      case VariableInstruction.A:
        this.registerBanck.A = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.B:
        this.registerBanck.B = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.C:
        this.registerBanck.C = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.D:
        this.registerBanck.D = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.E:
        this.registerBanck.E = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.F:
        this.registerBanck.F = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.G:
        this.registerBanck.G = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      case VariableInstruction.H:
        this.registerBanck.H = await this.AluInstruction(tipoOperacion, primeraVariable, segundaVariable);
        break;
      default:
        this.error = "Variable no existe"
        break;
    }
  }

  private async AluInstruction(operacion: OperationInstruction, operando1: number | VariableInstruction | undefined, operando2: number | VariableInstruction | undefined): Promise<number> {
    if (operando1 == undefined || operando2 == undefined) {
      this.error = "Operandos no válidos"
    }
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.ALU;
    })
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.BANCO_REGISTROS;
    })
    const numero1 = this.GetRegisterBank(operando1);
    const numero2 = this.GetRegisterBank(operando2);
    const resultadoOperacion = this.ALU.RunOperation(operacion, numero1, numero2);
    if(this.ALU.error != ''){
      this.error = this.ALU.error;
    }
    return resultadoOperacion;
  }

  private GetRegisterBank(variableAObtener: number | VariableInstruction | undefined) {
    if (variableAObtener == undefined) {
      this.error = "Variable no existe";
      return 0;
    }
    switch(variableAObtener) {
      case VariableInstruction.A:
        return this.registerBanck.A;
      case VariableInstruction.B:
        return this.registerBanck.B;
      case VariableInstruction.C:
        return this.registerBanck.C;
      case VariableInstruction.D:
        return this.registerBanck.D;
      case VariableInstruction.E:
        return this.registerBanck.E;
      case VariableInstruction.F:
        return this.registerBanck.F;
      case VariableInstruction.G:
        return this.registerBanck.G;
      case VariableInstruction.H:
        return this.registerBanck.H;
      default:
        this.error = "Variable no existe";
        return variableAObtener;
    }
  }

  private async MoveInstruction(variableOrigen: number | VariableInstruction | undefined, variableDestino: number | VariableInstruction | undefined): Promise<void> {
    if (variableOrigen == undefined || variableDestino == undefined) {
      this.error = "Variable no existe";
    }
    await this.executeTaskService.ExecuteTaskAfterTime(() => {
      this.activeElement = ProcessorElements.BANCO_REGISTROS;
    })
    switch(variableDestino) {
      case VariableInstruction.A:
        this.registerBanck.A = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.B:
        this.registerBanck.B = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.C:
        this.registerBanck.C = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.D:
        this.registerBanck.D = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.E:
        this.registerBanck.E = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.F:
        this.registerBanck.F = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.G:
        this.registerBanck.G = this.GetRegisterBank(variableOrigen);
        break;
      case VariableInstruction.H:
        this.registerBanck.H = this.GetRegisterBank(variableOrigen);
        break;
      default:
        this.error = "Variable no existe";
        break;
    }
  }



  get habilitarBtnEjecutar(): boolean {
    return this.computerState == States.SIN_INICIAR;
  }

  get habilitarBtnPausar(): boolean {
    return this.computerState == States.EN_EJECUCION;
  }

  get habilitarBtnReanudar(): boolean {
    return this.computerState == States.PAUSADO;
  }

  get unidadControlEstaActiva(): boolean {
    return this.activeElement == ProcessorElements.UNIDAD_CONTROL;
  }

  get memoriaEstaActiva(): boolean {
    return this.activeElement == ProcessorElements.MEMORIA;
  }

  get aluEstaActiva(): boolean {
    return this.activeElement == ProcessorElements.ALU;
  }

  get almacenGeneralEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.BANCO_REGISTROS;
  }

  get pcEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.PC;
  }

  get marEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.MAR;
  }

  get mbrEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.MBR;
  }

  get irEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.IR;
  }

  get busDatosEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.BUS_DATOS;
  }

  get busDireccionesEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.BUS_DIRECCIONES;
  }

  get busControlEstaActivo(): boolean {
    return this.activeElement == ProcessorElements.BUS_CONTROL;
  }

}
