import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { from } from 'rxjs'
import { HttpHeaders, HttpClient,HttpResponse,HttpRequest } from '@angular/common/http';

import { DOCUMENT } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import {saveAs} from 'file-saver';
import { parseNumbers } from 'xml2js/lib/processors';
import Swal from 'sweetalert2';
import { NavigationExtras } from '@angular/router'

import {FormsModule} from '@angular/forms';

   declare var angular: any;






@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  domicilio: any='';
  nombre: any=''; 
  regimen: any=''; 
  rfc : any='';
  cfdi: any='';
  folio : any ='';
  correo : any ='';
  
  facturado : boolean = false;
  impri : boolean = false;

  token : any ;
 
  xmlResponse!: string;
  seleccionado: any ;
   load: boolean;
   pago: any ;
   pagos: any =[{id:"01",nombre:"Efectivo"},{id:"02",nombre:"Cheque Normativo"},{id:"03",nombre:"Transferencia electrónica de fondos"}
   ,{id:"04",nombre:"Tarjeta de credito"},{id:"05",nombre:"Monedero electronico"},{id:"06",nombre:"Dinero electronico"},
   {id:"08",nombre:"Vales de despensa"},{id:"12",nombre:"Dacion de pago"},{id:"13",nombre:"Pago por subrogación"},
   {id:"14",nombre:"Pago por consignación"}, {id:"15",nombre:"Condonación"},{id:"17",nombre:"Compensación"}
   ,{id:"23",nombre:"Novacion"},{id:"24",nombre:"Novacion"},{id:"24",nombre:"Confusion"},{id:"25",nombre:"Remision de deuda"},
   {id:"26",nombre:"Prescripcion o caducidad"},{id:"27",nombre:"A satisfaccion del acreedor"},{id:"28",nombre:"Tarjeta de debito"}
   ,{id:"29",nombre:"Tarjeta de servicios"},{id:"29",nombre:"Aplicacion de anticipos"},{id:"99",nombre:"Por definir"}];

  cfd= [{id:"G01", nombre:"Adquisición de mercancías"},{id:"G02",nombre:"Devoluciones, descuentos o bonificaciones"},
  {id:"G03",nombre:"Gastos en general"},{id:"I01",nombre:"Construcciones"},{id:"I02",nombre:"Mobiliario y equipo de oficina por inversiones"},
  {id:"I03",nombre:"Equipo de transporte"},{id:"I04",nombre:"Equipo de cómputo y accesorios"},{id:"I05",nombre:"Dados, troqueles, moldes, matrices y herramental"},
  {id:"I06",nombre:"Comunicaciones telefónicas"},{id:"I07",nombre:"Comunicaciones satelitales"},{id:"I08",nombre:"Otra maquinaria y equipo"},
  {id:"D01",nombre:"Honorarios médicos, dentales y gastos hospitalarios."},{id:"D02",nombre:"Gastos médicos por incapacidad o discapacidad"},
  {id:"D03",nombre:"Gastos funerales."},{id:"D04",nombre:"Donativos"},{id:"D05",nombre:"Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)."},
  {id:"D06",nombre:"Aportaciones voluntarias al SAR."},{id:"D07",nombre:"Primas por seguros de gastos médicos."},
  {id:"D08",nombre:"Gastos de transportación escolar obligatoria."},{id:"D09",nombre:"Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones."},
  {id:"D10",nombre:"Pagos por servicios educativos (colegiaturas)"},{id:"P01",nombre:"Por definir"}];
 
  headers: any;
  xmlItems: any;
  url1: any
  alerta(error: any)
  {Swal.fire({
   icon: 'error',
   title: 'Error en el envio de datos ',
   text: error,
  
 })
 
}
error()
  {Swal.fire({
   icon: 'error',
   title: 'Error en el envio de datos ',
   text: 'debes escribir el folio para comprobar',
   
 })
}
error2()
  {Swal.fire({
   icon: 'error',
   title: 'Error en el envio de datos ',
   text: 'Este Folio no existe ',
   
 })
}
error3()
  {Swal.fire({
   icon: 'error',
   title: 'Error en el envio de datos ',
   text: 'No todos los campos estan llenos  ',
   
 })
}
success()
{ 
   Swal.fire({
      //position: 'top-end',
      icon: 'success',
      title: 'Se ha geneado CFDI4.0 exitosamente',
      showConfirmButton: true,
      //timer: 1500
    })
}
  
  constructor( private http:HttpClient, private router:Router,private route: ActivatedRoute) { 
    
   this.load = true;
   
   }

  ngOnInit(): void {
   
    
    this.checkAPI();


    }

   
   
   
//Metodo abrir en componente alerta 
   pass(): void {
      setTimeout(() => {
         this.load = true;
       }, 5000);
      this.router.navigate(['/alerta'], { relativeTo: this.route });
  }
// Metodo para la solicitud SOAP para generar el CFDI4.0 
soapCal(conceptos: any,preU: any,preI: any,folio:any ) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.open('POST', 'https://app.fel.mx/CR33Test/ConexionRemota.svc', true);
   
  

  // The following variable contains the xml SOAP request.
  const sr =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:tes="http://schemas.datacontract.org/2004/07/TES.V33.CFDI.Negocios">
      <soapenv:Header/>
      <soapenv:Body>
         <tem:GenerarCFDI40>
            <!--Optional:-->
             <tem:credenciales>
               <!--Optional:-->
               <tes:Cuenta>TES030201001</tes:Cuenta>
               <!--Optional:-->
               <tes:Password>TES030201001j+</tes:Password>
               <!--Optional:-->
               <tes:Usuario>TES030201001</tes:Usuario>
            </tem:credenciales>
            <!--Optional:-->
            <tem:cfdi>
               <!--Optional:-->
               <tes:ClaveCFDI>FAC</tes:ClaveCFDI>
               <!--Optional:-->   
               <!--Optional:-->
               <tes:Conceptos>
                  <!--Zero or more repetitions:-->
                  `+conceptos+`
               </tes:Conceptos>
               <!--Optional:-->
               <tes:CondicionesDePago>CONTADO</tes:CondicionesDePago>
               <!--Optional:-->
               <tes:Emisor>
                  <!--Optional:-->
                  <tes:Nombre>Compuhipermegared</tes:Nombre>
                  <!--Optional:-->
                  <tes:RegimenFiscal>601</tes:RegimenFiscal>
               </tes:Emisor>
              
         <!--Optional:-->
         <tes:Exportacion>01</tes:Exportacion>
         <!--Optional:-->
         <tes:Folio>`+folio+`</tes:Folio>
               <!--Optional:-->
               <tes:FormaPago>`+this.pago+`</tes:FormaPago>
               <!--Optional:-->
               <tes:LugarExpedicion>72000</tes:LugarExpedicion>
               <!--Optional:-->
               <tes:MetodoPago>PUE</tes:MetodoPago>
               <!--Optional:-->
               <tes:Moneda>MXN</tes:Moneda>
               <!--Optional:-->
               <tes:Receptor>
                  <!--Optional:-->
                  <tes:DomicilioFiscalReceptor>`+this.domicilio+`</tes:DomicilioFiscalReceptor>
                  <!--Optional:-->
                  <tes:Nombre>`+this.nombre+`</tes:Nombre>
                  <!--Optional:-->
                  <tes:RegimenFiscalReceptor>`+this.regimen+`</tes:RegimenFiscalReceptor>
                  <!--Optional:-->
                  <tes:Rfc>`+this.rfc+`</tes:Rfc>
                  <!--Optional:-->
                  <tes:UsoCFDI>`+this.seleccionado+`</tes:UsoCFDI>
               </tes:Receptor>              
               <!--Optional:-->
               <tes:Referencia>0001</tes:Referencia>
               <!--Optional:-->
               <tes:SubTotal>`+preU+`</tes:SubTotal>
               <!--Optional:-->
               <tes:TipoCambio>1</tes:TipoCambio>
               <!--Optional:-->
               <tes:Total>`+preI+`</tes:Total>
               <!--Optional:-->
            </tem:cfdi>
         </tem:GenerarCFDI40>
      </soapenv:Body>
   </soapenv:Envelope>`;
   console.log(sr);

 // Si la conexion con el sevidor fue exitosa 
   xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
              const xml = xmlhttp.responseXML;  // se obtiene la respuesta del servidor                   
            const xml2=xml!.getElementsByTagName('a:XML')[0].textContent;// se Obtiene el string del xml , se busca la etiqueta XMl en el xml de la respuesta                       
           
           const encuentra = xml2!.search('UUID')// se crea una variable para obtener la posicion del uuid en el string del xml 
           const error = xml!.getElementsByTagName('a:ErrorGeneral')[0].textContent;//se Obtiene el string del error , se busca la etiqueta ErrorGeneral en el xml de la respuesta
const id=xml2?.substring(encuentra+6 ,encuentra+42)// Se busca la cadena del UUID con la posicion obtenida y se quita el nombre y las comillas de la cadena 

              console.log(id,error);
            // El Xml de respuesta tiene el campo error vacio si la solicitud fue exitosa en se caso se procede a la descarga 
             if(error=='')
             {
//this.success();
this.downloadFile(xml2) // se manada el xml para su dercarga 
this.generarPDF(id); //se manda el uuid para generar el PDF
this.mandarCorreo(id);// se manda el uuid para mandar el correo  
this.pass();
this.facturaRecibo(id)//se manda uuid para confirmar su facturacion 

             }  
             else{
                this.alerta(error);
                this.load=true;
                
             }                     
          }
      }
  }
  // Send the POST request.
  xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
  //xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
  //xmlhttp.setRequestHeader('Access-Control-Allow-Headears', 'Content-Type, Accept')
  //xmlhttp.setRequestHeader('Access-Control-Allow-Credencials', 'true')
  //xmlhttp.setRequestHeader('GET', 'POST')
  xmlhttp.setRequestHeader("SOAPAction", "http://tempuri.org/IConexionRemota/GenerarCFDI40");// se manada un header con metodo de la solicitud SOAP
  xmlhttp.responseType = 'document' ;
  xmlhttp.send(sr);// se manda la solicitud SOAP
  
}

downloadFile(data: any) {
   var blob = new Blob([data], { type: 'text/xml' });// se crea la variable para el archivo de descarga , se inserta la informacion y el tipo xml 
   var url = window.URL.createObjectURL(blob);
   saveAs(blob, this.folio+'cfdi4_0.xml');// se coloa el nombre el archivoy la informacion
   window.open(url);// se realiza la descarga
   
   
 }
 downloadPDF(data: any) {
   
   const byteArray = new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)));// se traduce el codigo baseCode64
   var blob = new Blob([byteArray], { type: 'application/pdf' });// se crea la variable para el archivo de descarga , se inserta la informacion y el tipo PDF
   var url = window.URL.createObjectURL(blob);
 

   saveAs(blob, this.folio+'cfdi4_0.pdf'); // se coloa el nombre el archivoy la informacion
   window.open(url); // se realiza la descarga 
   
   
 }

 //Metodo para generar el PDF se requiere el UUID de la factura
 generarPDF(uuid:any)
 {
   
   const xmlhttp2 = new XMLHttpRequest();
   xmlhttp2.open('POST', 'https://app.fel.mx/CR33Test/ConexionRemota.svc', true);
    
   // The following variable contains the xml SOAP request.
   const sr =
       `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:tes="http://schemas.datacontract.org/2004/07/TES.V33.CFDI.Negocios">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:ObtenerPDF40>
             <!--Optional:-->
             <tem:credenciales>
                <!--Optional:-->
                <tes:Cuenta>TES030201001</tes:Cuenta>
                <!--Optional:-->
                <tes:Password>TES030201001j+</tes:Password>
                <!--Optional:-->
                <tes:Usuario>TES030201001</tes:Usuario>
             </tem:credenciales>
             <!--Optional:-->
             <tem:uuid>`+uuid+`</tem:uuid>
             <!--Optional:-->
             <tem:nombrePlantilla xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
          </tem:ObtenerPDF40>
       </soapenv:Body>
    </soapenv:Envelope>`;
 // Si la conexion con el sevidor fue exitosa 
   xmlhttp2.onreadystatechange =  () => {
       if (xmlhttp2.readyState == 4) {
           if (xmlhttp2.status == 200) {
               const xml = xmlhttp2.responseXML;  // se obtiene la respuesta del servidor                                     
             const xml2=xml?.getElementsByTagName('a:PDF')[0].textContent;// se Obtiene el string del PDF , se busca la etiqueta PDF en el xml de la respuesta
                                 
 this.downloadPDF(xml2)// se manda el string del PDF en baseCode 64
               console.log(xml);// se manda la solicitud SOAP
                            
           }
       }
   }
   // Send the POST request.
   xmlhttp2.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Origin', '*')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Headears', 'Content-Type, Accept   ')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Credencials', 'true')
   //xmlhttp.setRequestHeader('GET', 'POST')
   xmlhttp2.setRequestHeader("SOAPAction", "http://tempuri.org/IConexionRemota/ObtenerPDF40");// se manada un header con metodo de la solicitud SOAP
   xmlhttp2.responseType = 'document' ;
   xmlhttp2.send(sr);
 }

 //Metodo para generar el correo se requiere el UUID de la factura
 mandarCorreo(uuid:any)
 {
   
   const xmlhttp2 = new XMLHttpRequest();
   xmlhttp2.open('POST', 'https://app.fel.mx/CR33Test/ConexionRemota.svc', true);
    
   // The following variable contains the xml SOAP request.
   const sr =
       `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:tes="http://schemas.datacontract.org/2004/07/TES.V33.CFDI.Negocios">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:EnviarCFDI40>
             <!--Optional:-->
             <tem:credenciales>
                <!--Optional:-->
                <tes:Cuenta>TES030201001</tes:Cuenta>
                <!--Optional:-->
                <tes:Password>TES030201001j+</tes:Password>
                <!--Optional:-->
                <tes:Usuario>TES030201001</tes:Usuario>
             </tem:credenciales>
             <!--Optional:-->
             <tem:uuid>`+uuid+`</tem:uuid>
             <!--Optional:-->
             <tem:email>`+this.correo+`</tem:email>
             <!--Optional:-->
             <tem:titulo>?</tem:titulo>
             <!--Optional:-->
             <tem:mensaje>?</tem:mensaje>
             <!--Optional:-->
             <tem:nombrePlantilla>?</tem:nombrePlantilla>
          </tem:EnviarCFDI40>
       </soapenv:Body>
    </soapenv:Envelope>`;
 // Si la conexion con el sevidor fue exitosa 
   xmlhttp2.onreadystatechange =  () => {
       if (xmlhttp2.readyState == 4) {
           if (xmlhttp2.status == 200) {
               const xml = xmlhttp2.responseXML;    // se obtiene la respuesta del servidor                                  
             const xml2=xml?.getElementsByTagName('a:OperacionExitosa')[0].textContent;// se Obtiene el string de la OperacionExitosa , se busca la etiqueta  OperacionExitosa en el xml de la respuesta 
                                 
 
               console.log(xml2);
                            
           }
       }
   }
   // Send the POST request.
   xmlhttp2.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Origin', '*')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Headears', '...All Headers...')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Credencials', 'true')
   //xmlhttp.setRequestHeader('GET', 'POST')
   xmlhttp2.setRequestHeader("SOAPAction", "http://tempuri.org/IConexionRemota/EnviarCFDI40"); // se manada un header con metodo de la solicitud SOAP
   xmlhttp2.responseType = 'document' ;
   xmlhttp2.send(sr);// se manda la solicitud 
 }
 //Metodo para generar el XML se requiere el uuid de la factura
 generarXML(uuid:any)
 {
   const xmlhttp2 = new XMLHttpRequest();
   xmlhttp2.open('POST', 'https://app.fel.mx/CR33Test/ConexionRemota.svc', true);

   // The following variable contains the xml SOAP request.
   const sr =
       `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:tes="http://schemas.datacontract.org/2004/07/TES.V33.CFDI.Negocios">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:ObtenerXMLPorUUID40>
             <!--Optional:-->
             <tem:credenciales>
                <!--Optional:-->
                <tes:Cuenta>TES030201001</tes:Cuenta>
                <!--Optional:-->
                <tes:Password>TES030201001j+</tes:Password>
                <!--Optional:-->
                <tes:Usuario>TES030201001</tes:Usuario>
             </tem:credenciales>
             <!--Optional:-->
             <tem:uuid>`+uuid+`</tem:uuid>
          </tem:ObtenerXMLPorUUID40>
       </soapenv:Body>
    </soapenv:Envelope>`;
 
   xmlhttp2.onreadystatechange =  () => {
       if (xmlhttp2.readyState == 4) {
           if (xmlhttp2.status == 200) {
               const xml = xmlhttp2.responseXML;                                   
             const xml2=xml?.getElementsByTagName('a:XML')[0].textContent;
                                 

 this.downloadFile(xml2)
 this.generarPDF(uuid); 
this.mandarCorreo(uuid);
this.pass();
               console.log(xml2);
                            
           }
       }
   }
   // Send the POST request.
   xmlhttp2.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Origin', '*')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Headears', 'Content-Type, Accept   ')
   //xmlhttp2.setRequestHeader('Access-Control-Allow-Credencials', 'true')
   //xmlhttp.setRequestHeader('GET', 'POST')
   xmlhttp2.setRequestHeader("SOAPAction", "http://tempuri.org/IConexionRemota/ObtenerXMLPorUUID40");
   xmlhttp2.responseType = 'document' ;
   xmlhttp2.send(sr);

 }
 
 //Metodo para generar el toker para las solicitudes al servidor 
 checkAPI()
 {
   const body = {  "nombreUsuario": "max",
   "password": "F0G6sUwEK38=" }
   this.http.post<any>('http://192.168.20.57:8090/auth/login',body,{ }).subscribe(data => {
  
   console.log(data.token);
   // se guarda el token en una variable global
     this.token= data.token
     }, error => {
       console.log(error);
   });
}
// Metodo para comprobar el folio 
comprobarFactura()
{

   this.load=false;
   // Se comprueba si el campo folio esta vacio 
   if (this.folio=='')
   {
this.error();
this.load=true;
   }
   else{
      // se manda el folio y el token en la solicitud post 
   const body = {   "recibo" : this.folio }
   const headers = { 'Authorization': 'Bearer '+this.token+' '};
   this.http.post<any>('http://192.168.20.57:8090/alpha/obtenerRecibo',body,{headers }).subscribe(data => {
    
   //El servicio regresa dos tipos de JSON cuando no esta facturado manda un array de arrays y si esta facturado solo manda un array 
   // Por ello para comprobar la facturacion , se obtiene el largo de array cuando no esta facturado y se guarda en una variable 
   // Esto hara que cuando si este facturado nos de un indefinido 
   const dato= data.length
   console.log(data, dato );
      
   
 // si largo es mayor a 0 significa que no esta facturado y tiene conceptos por facturar  
 if(dato>0){

    this.facturado= true
    this.impri= false
    this.load=true
    this.correo= data[0].correo
    
 }
 //El servidor respondera con array vacio en caso de que no encuentre un folio , en ese caso se manda un error 
 else if (dato==0)
 {
     this.error2();
     this.load= true
 }
 // Y por ultimo se es indefinido significa que esta facturado 
 else  
 {
    this.facturado= false
    this.impri= true
    this.load= true
 }


       

 
     }, error => {
       console.log(error);
       this.error2();
       this.load= true
   });
   
}
}
//Metodo para generar una factura 
OrdenVenta()
 {
    this.load=false;
    // Se comprueba se los campos del formulario estan vacios 
    if(this.domicilio==''||this.nombre==''||this.regimen==''||this.rfc==''|| this.correo==''|| this.seleccionado==''|| this.pago=='')
    {
this.error3();
this.load= true 

    }
    else{
// se vuelve a mandar el folio para generar la factura 
   const body = {   "recibo" : this.folio }
   const headers = { 'Authorization': 'Bearer '+this.token+' '};
   this.http.post<any>('http://192.168.20.57:8090/alpha/obtenerRecibo',body,{headers }).subscribe(data => {
      const dato= data.length
      
   console.log(data, "el largo es :" +dato);
   
 
  // Se manda los conceptos y la cantidad de los conceptos 
       
this.generarConceptos(dato, data);
 
     }, error => {
       console.log(error);
   });
}
}
// Metodo  Para volver a descargar una factura 
imprimir(){
   this.load=false 
   // se manda el folio y se hace la peticion al servidor 
   const body = {   "recibo" : this.folio }
   const headers = { 'Authorization': 'Bearer '+this.token+' '};
   this.http.post<any>('http://192.168.20.57:8090/alpha/obtenerRecibo',body,{headers }).subscribe(data => {
      const dato= data.uuid
      
   console.log(data, "el uuid :" +dato);
   
   // se obtiene el uuid de la factura y se manda para su descarga 
 this.generarXML(dato)
  
       

 
     }, error => {
       console.log(error);
   });

}
// Metodo para subir al servidor cuando un folio ha sido facturado 
facturaRecibo(  uuid: any )
 {
    //Se inserta en body el folio y el uuid de la factura generada 
   const body = {   "recibo" : this.folio, "factura": uuid
 }
   const headers = { 'Authorization': 'Bearer '+this.token+' '};
   this.http.post<any>('http://192.168.20.57:8090/alpha/facturarRecibo',body,{headers }).subscribe(data => {
      
      
   console.log(data);
   
 
      
       
 
     }, error => {
       console.log(error);
   });
}
//Metodo para generar la estructura de los conceptos parala factura , se require los datos de los conceptos y la cantidad 
generarConceptos(dato: any, data: any  ){
   let conceptos = '';
   let precioUnit=0;
   let precioIva=0;
   //Se hace un bucle for dependiendo la cantida de conceptos para generar la plantilla xml de los conceptos 
   for(let i = 0;i < dato ; i++ ) 
   { 
      // si el precio unitaro es menor que el precio unitarioIva significa el concepto tiene IVA
      if (data[i].precioUnitario<data[i].precioUnitarioIVA)
   { // se genera una plantilla xml de un concepto insertando los datos de cada uno 
      let concepto=`<tes:Concepto40R>
      <!--Optional:-->
      <tes:Cantidad>1.00</tes:Cantidad>
      <!--Optional:-->
      <tes:ClaveProdServ>`+data[i].clave+`</tes:ClaveProdServ>
      <!--Optional:-->
      <tes:ClaveUnidad>`+data[i].codigo+`</tes:ClaveUnidad>
      <!--Optional:-->
      <tes:Descripcion>`+data[i].concepto+`</tes:Descripcion>
      <!--Optional:-->
      <tes:Importe>`+(data[i].precioUnitarioIVA/1.16).toFixed(2)+`</tes:Importe>
      <!--Optional:-->
      <tes:Impuestos>
         <!--Optional:-->
         <tes:Traslados>
            <!--Zero or more repetitions:-->
            <tes:TrasladoConcepto40R>
               <!--Optional:-->
               <tes:Base>`+(data[i].precioUnitarioIVA/1.16).toFixed(2)+`</tes:Base>
               <!--Optional:-->
               <tes:Importe>`+Math.round(((data[i].precioUnitarioIVA/1.16)*0.16)*100)/100+`</tes:Importe>
               <!--Optional:-->
               <tes:Impuesto>002</tes:Impuesto>
               <!--Optional:-->
               <tes:TasaOCuota>0.160000</tes:TasaOCuota>
               <!--Optional:-->
               <tes:TipoFactor>Tasa</tes:TipoFactor>
            </tes:TrasladoConcepto40R>
         </tes:Traslados>
         <!--Optional:-->
      </tes:Impuestos>
      <!--Optional:-->
      <tes:NoIdentificacion>`+data[i].idProducto+`</tes:NoIdentificacion>
      <!--Optional:-->
      <tes:ObjetoImp>02</tes:ObjetoImp>
      <!--Optional:-->
      <tes:Unidad>`+data[i].unidad+`</tes:Unidad>
      <!--Optional:-->
      <tes:ValorUnitario>`+(data[i].precioUnitarioIVA/1.16).toFixed(4)+`</tes:ValorUnitario>
      <!--Optional:-->
   </tes:Concepto40R>`;
conceptos+=concepto//se inserta el cocepto en un string 
precioUnit+=Math.round(((data[i].precioUnitarioIVA/1.16))*100)/100// se hace la suma de los conceptos 
precioIva+=data[i].precioUnitarioIVA
   }
   // si el concepto no tiene IVA
   else{
      let concepto2=`<tes:Concepto40R>
   <!--Optional:-->
   <tes:Cantidad>1.00</tes:Cantidad>
   <!--Optional:-->
   <tes:ClaveProdServ>`+data[i].clave+`</tes:ClaveProdServ>
   <!--Optional:-->
   <tes:ClaveUnidad>`+data[i].codigo+`</tes:ClaveUnidad>
   <!--Optional:-->
   <tes:Descripcion>`+data[i].concepto+`</tes:Descripcion>
   <!--Optional:-->
   <tes:Importe>`+(data[i].precioUnitarioIVA/1.16).toFixed(2)+`</tes:Importe>
   <!--Optional:-->
   <tes:Impuestos>
      <!--Optional:-->
      <tes:Traslados>
         <!--Zero or more repetitions:-->
         <tes:TrasladoConcepto40R>
            <!--Optional:-->
            <tes:Base>`+(data[i].precioUnitarioIVA/1.16).toFixed(2)+`</tes:Base>
            <!--Optional:-->
            <tes:Importe>0</tes:Importe>
            <!--Optional:-->
            <tes:Impuesto>002</tes:Impuesto>
            <!--Optional:-->
            <tes:TasaOCuota>0.000000</tes:TasaOCuota>
            <!--Optional:-->
            <tes:TipoFactor>Tasa</tes:TipoFactor>
         </tes:TrasladoConcepto40R>
      </tes:Traslados>
      <!--Optional:-->
   </tes:Impuestos>
   <!--Optional:-->
   <tes:NoIdentificacion>`+data[i].idProducto+`</tes:NoIdentificacion>
   <!--Optional:-->
   <tes:ObjetoImp>02</tes:ObjetoImp>
   <!--Optional:-->
   <tes:Unidad>`+data[i].unidad+`</tes:Unidad>
   <!--Optional:-->
   <tes:ValorUnitario>`+(data[i].precioUnitarioIVA/1.16).toFixed(4)+`</tes:ValorUnitario>
   <!--Optional:-->
</tes:Concepto40R>`;
conceptos+=concepto2

precioUnit+=Math.round(((data[i].precioUnitarioIVA/1.16))*100)/100
precioIva+=data[i].precioUnitarioIVA
   }

   }
  
   console.log(conceptos)
   this.soapCal(conceptos, precioUnit, precioIva,data[0].folio);// se manda el string de los conceptos , el total del precio unitario, el total del precio unitarioIva , y el folio 

}



}
