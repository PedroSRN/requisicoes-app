import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  registros: AngularFirestoreCollection<Requisicao>


  constructor(private firestore: AngularFirestore) {
    this.registros =
        this.firestore.collection<Requisicao>("requisicoes");
   }

   public async inserir(registro: Requisicao): Promise<any>{
      if(!registro)
        return Promise.reject("Item Inválido");

      const res = await this.registros.add(registro);

      registro.id = res.id;

      registro.dataAbertura = Date.now();

      this.registros.doc(res.id).set(registro);
   }

   public async editar(registro:Requisicao): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Requisicao[]> {
    return this.registros.valueChanges()
      .pipe(
        map((requisicoes: Requisicao[]) => {
          requisicoes.forEach(requisicoes => {
            this.firestore
            .collection<Departamento>("departamentos")
            .doc(requisicoes.departamentoId)
            .valueChanges()
            .subscribe(x => requisicoes.departamento = x);
          });


          return requisicoes;
        })
      );
  }
}
