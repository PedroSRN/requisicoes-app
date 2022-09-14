import { Component, Input, OnInit } from '@angular/core';
import { __importDefault } from 'tslib';
import { Requisicao } from '../../models/requisicao.model';

@Component({
  selector: 'app-requisicao-detalhes',
  templateUrl: './requisicao-detalhes.component.html',
})
export class RequisicaoDetalhesComponent {
 @Input() requisicao:Requisicao
}
