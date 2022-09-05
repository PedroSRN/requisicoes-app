import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public formRecuperacao: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private toastrService: ToastrService
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl("", [Validators.email, Validators.required]),
      senha: new FormControl("", [Validators.required])
    });

    this.formRecuperacao = this.formBuilder.group({
      emailRecuperacao: new FormControl("")
    })
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }
  get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  get emailRecuperacao(): AbstractControl | null {
    return this.formRecuperacao.get("emailRecuperacao");
  }

  public async login() {
    const email = this.email?.value;
    const senha = this.senha?.value;

    try {
      const resposta = await this.authService.login(email, senha);

      if(resposta?.user){
        this.router.navigate(["/painel"])
        this.toastrService.success("Bem Vindo ao Sistema de Requisições", "Sistema de Requisições")
      }
    } catch (error) {
      console.log(error);
      this.toastrService.error("Houve um erro ao Logar em sua conta. Tente novamente.", "Sistema de Requisições")
    }
  }

  public abrirModalRecuperacao(modal: TemplateRef<any>){
    this.modalService.open(modal)
      .result
      .then(resultado => {
        if(resultado === "enviar"){
          this.authService.resetarSenha(this.emailRecuperacao?.value);
        }
      })
      .catch(() => {
        this.formRecuperacao.reset();
      });
  }
}
