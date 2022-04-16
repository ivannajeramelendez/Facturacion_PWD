import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {
  success()
  {
     Swal.fire({
        //position: 'top-end',
        icon: 'success',
        title: 'Se ha geneado CFDI4.0 exitosamente',
        showConfirmButton: true,
        //timer: 1500
        confirmButtonText:
        '<a href="/home">Regresar</a> ',
        
      })
  }
  constructor() { }

  ngOnInit(): void {
    this.alerta1();
  }

  alerta1()
  {
    this.success();
    
  }
}
