import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/service/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './service/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private requisicaoService : RequisicaoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),
      dataAbertura: new FormControl(""),
      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl("",),
      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),
    });

    this.requisicoes$= this.requisicaoService.selecionarTodos();
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null{
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get dataAbertura(): AbstractControl | null {
    return this.form.get("dataAbertura");
  }

  get departamentoId() {
    return this.form.get("departamentoId");
  }

  get funcionarioId() {
    return this.form.get("funcionarioId");
  }

  get equipamentoId() {
    return this.form.get("requiequipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if (requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const RequisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }

      this.form.get("requisicao")?.setValue(RequisicaoCompleta);
    }
    try{
      await this.modalService.open(modal).result;


      if(!requisicao){
        await this.requisicaoService.inserir(this.form.get("requisicao")?.value);
        this.toastrService.success(`A requisição foi salva com sucesso`, "Cadastro de Requisição")
      }
      else{
        await this.requisicaoService.editar(this.form.get("requisicao")?.value)
        this.toastrService.success(`A requisição foi alterado com sucesso`, "Atualização de Requisição");
      }

    } catch(error){
      if(error != "fechar" && error != "0" && error != "1")
      console.log(error)
      this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente.", "Cadastro de Requisição")
    }
  }

  public excluir(requisicao: Requisicao){
    try{
    this.requisicaoService.excluir(requisicao);

    this.toastrService.success(`A requisição foi excluída com sucesso`, "Exclusão de Requisição");
    }catch (error){
      this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente.", "Exclusão de Requisição")
    }
  }
}
