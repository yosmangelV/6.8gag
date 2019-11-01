import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ViewController } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";

@IonicPage()
@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

	titulo:string="";
	imagenPreview:string="";
	imagen64:string;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				private viewCtrl:ViewController,
				private camera:Camera,
				private imagePicker: ImagePicker,
				private cargarArchivo: CargaArchivoProvider
				) {
		
	}

	cerrar_modal(){
	  this.viewCtrl.dismiss();
	}

	mostrar_camara(){
		const options: CameraOptions = {
		  quality: 60,
		  destinationType: this.camera.DestinationType.DATA_URL,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE,
		}

		this.camera.getPicture(options).then((imageData) => {
		 	console.log("IMAGEEEEN--------> "+imageData);
			this.imagenPreview =  'data:image/jpeg;base64,' +imageData;
			this.imagen64=imageData;

		}, (err) => {
		 	console.log("ERROOOOOOR ----> " +JSON.stringify(err));
		});
	}

	mostrar_galeria(){
		let options:ImagePickerOptions={
			quality: 10,
			outputType:1,
			maximumImagesCount:1
		  	
		};

		this.imagePicker.getPictures(options).then((results) => {
		  for (var i = 0; i < results.length; i++) {
		      console.log('Image URI: ---------> ' + results[i]);
		      this.imagenPreview =  'data:image/jpeg;base64,' +results[i];
		      this.imagen64=results[i];
		  }
		}, (err) => {
			console.log("ERROR ----> "+ JSON.stringify(err));
		});
	}

	crear_post(){

		let archivo={
			img:this.imagen64,
			titulo:this.titulo
		}

		this.cargarArchivo.cargar_imagen_firebase(archivo).then(
			()=>this.cerrar_modal()
			);
		
	}
}
