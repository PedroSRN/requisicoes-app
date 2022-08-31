import { TestBed } from '@angular/core/testing';

import { EquipamentoService } from './equipamento.service';

describe('EquipamentoService', () => {
  let service: EquipamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
