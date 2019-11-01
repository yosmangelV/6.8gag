import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';
import {CargaArchivoProvider} from "../../providers/carga-archivo/carga-archivo";
import { SocialSharing } from '@ionic-native/social-sharing';
//import { AngularFireDatabase } from '@angular/fire/database';
//import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	//posts: Observable<any[]>;
    hayMas:boolean=true;

  	constructor(public navCtrl: NavController,
  	 			private modalCtrl:ModalController,
           private _cargarArchivo:CargaArchivoProvider,
           private socialSharing: SocialSharing) {

  		//this.posts = afDB.list('post').valueChanges();
      
  	}

  	mostrar_modal(){
  		let modal=this.modalCtrl.create(SubirPage);

  		modal.present();
  	}
    doInfinite(infiniteScroll){

      console.log("Begin async operation");

      this._cargarArchivo.cargar_imagenes()
          .then((hayMas:boolean)=>{
            this.hayMas=hayMas;
            infiniteScroll.complete();
           }
          );

      
      
    }

    compartir(post:any){
      //shareViaFacebook(message, image, url)
      console.log("----->COMPARTIR");
      console.log("-----> "+post);
      this.socialSharing.shareViaFacebook(post.titulo, post.img, post.img).then(() => {
        this._cargarArchivo.mostratToast("Imagen compartida");
      }).catch(() => {
        this._cargarArchivo.mostratToast("No se pudo compartir la imagen");
      });
    }
}
