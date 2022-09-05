import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { EquipamentoComponent } from './equipamento.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EquipamentoRoutingModule,

    NgxMaskModule.forChild(),
    CurrencyMaskModule
  ]
})
export class EquipamentoModule { }
