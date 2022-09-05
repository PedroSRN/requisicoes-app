import { Component, OnInit, TemplateRef } from '@angular/core';
import { validateEventsArray } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
})
export class EquipamentoComponent implements OnInit {
 public equipamentos$: Observable<Equipamento[]>
 public form: FormGroup;

 constructor(
   private fb: FormBuilder,
   private modalService: NgbModal,
   private equipamentoService: EquipamentoService,
   private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nroSerie: new FormControl("",[Validators.required, Validators.minLength(3)]),
      nome: new FormControl("",[Validators.required, Validators.minLength(3)]),
      preco: new FormControl("",[Validators.required]),
      dataFabricacao: new FormControl("", [Validators.required]),
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get nroSerie() {
    return this.form.get("nroSerie");
  }

  get nome() {
    return this.form.get("nome");
  }

  get preco() {
    return this.form.get("preco");
  }

  get dataFabricacao() {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if (equipamento)
      this.form.setValue(equipamento);

    try{
      await this.modalService.open(modal).result;


      if(!equipamento){
        await this.equipamentoService.inserir(this.form.value);
        this.toastrService.success(`O equipamento foi salvo com sucesso`, "Cadastro de Equipamentos")
      }
      else{
        await this.equipamentoService.editar(this.form.value)
        this.toastrService.success(`O equipamento foi alterado com sucesso`, "Atualização de Equipamentos");
      }

    } catch(error){
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Cadastro de Equipamentos")
    }
  }
  public excluir(equipamento: Equipamento){
    try{
    this.equipamentoService.excluir(equipamento);

    this.toastrService.success(`O equipamento foi excluído com sucesso`, "Exclusão de Equipamentos");
    }catch (error){
      this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Exclusão de Equipamentos")
    }
  }
}
