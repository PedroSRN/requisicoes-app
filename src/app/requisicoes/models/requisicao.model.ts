import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model"
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao {
  id: string;
  descricao: string;
  dataAbertura: Date | any;

  funcionarioId: string;
  funcionario?: Funcionario;

  departamentoId: string;
  departamento?: Departamento;

  equipamentoId?: string;
  equipamento?: Equipamento;

  status: string;
  ultimaAtualizacao: Date | any;
  movimentacoes: Movimentacao[]
}
