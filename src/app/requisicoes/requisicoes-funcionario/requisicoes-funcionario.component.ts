import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/service/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../service/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html',
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;

  public funcionarioLogado: Funcionario;
  public form: FormGroup;

  constructor(
    private authService:AuthenticationService,
    private requisicaoService : RequisicaoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      movimentacoes: new FormControl(""),
    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$= this.requisicaoService.selecionarTodos();

    this.funcionarioLogado = this.route.snapshot.data["funcionarioLogado"]

  }

  ngOnDestroy(): void {

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualiza????o" : "Cadastro";
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
    return this.form.get("equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    this.configurarValoresPadrao();

    if (requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const RequisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario
      }

      this.form.setValue(RequisicaoCompleta);
    }
    try{
      await this.modalService.open(modal).result;


      if(!requisicao){
        await this.requisicaoService.inserir(this.form?.value);
        this.toastrService.success(`A requisi????o foi salva com sucesso`, "Cadastro de Requisi????o")
      }
      else{
        await this.requisicaoService.editar(this.form?.value)
        this.toastrService.success(`A requisi????o foi alterado com sucesso`, "Atualiza????o de Requisi????o");
      }

    } catch(error){
      if(error != "fechar" && error != "0" && error != "1")
      console.log(error)
      this.toastrService.error("Houve um erro ao salvar a requisi????o. Tente novamente.", "Cadastro de Requisi????o")
    }
  }

  public excluir(requisicao: Requisicao){
    try{
    this.requisicaoService.excluir(requisicao);

    this.toastrService.success(`A requisi????o foi exclu??da com sucesso`, "Exclus??o de Requisi????o");
    }catch (error){
      this.toastrService.error("Houve um erro ao salvar a requisi????o. Tente novamente.", "Exclus??o de Requisi????o")
    }
  }

  private configurarValoresPadrao(): void{
    this.form.get("status")?.setValue("Aberta");
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("ultimaAtualizacao")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);
  }
}
