import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
import 'rxjs/add/operator/map';

@Injectable()
export class CargaArchivoProvider {

	imagenes:ArchivoSubir[]=[];
	lastKey:string=null; 


 	constructor(public toastCtrl: ToastController,
 				public afDB:AngularFireDatabase) {
   		this.cargar_ultimo_key().subscribe(()=>{
   			this.cargar_imagenes();
   		});
  	}

  	private cargar_ultimo_key(){
  		return this.afDB.list('/post', ref=> ref.orderByKey().limitToLast(1))
  				.valueChanges()
  				.map((post:any)=>{
  					console.log(post);
  					this.lastKey=post[0].key;
  					this.imagenes.push(post[0]);
  				});
  	}

  	cargar_imagenes(){
  		return new Promise((resolve,reject)=>{
  			this.afDB.list('/post',
  				ref=> ref.limitToLast(3)
  						 .orderByKey()
  						 .endAt(this.lastKey)
  				).valueChanges()
  				 .subscribe((posts:any)=>{
  				 	posts.pop();
  				 	if(posts.length == 0){
  				 		console.log("Ya no hay mas registro");
  				 		resolve(false);
  				 		return;
  				 	}
  					console.log(posts);
  					this.lastKey=posts[0].key;
  					console.log(this.lastKey);
  					for (var i = posts.length - 1; i >= 0; i--) {
  						this.imagenes.push(posts[i]);
  					}
  					
  					resolve(true);	
  				});
  		});

  	}


  	cargar_imagen_firebase(archivo:ArchivoSubir){
  		let promesa= new Promise((resolve,reject)=>{
  			this.mostratToast('Cargando...');

  			let storeRef= firebase.storage().ref();
  			let nombreArchivo:string= new Date().valueOf().toString();
			
			let uploadTask: firebase.storage.UploadTask=
				storeRef.child(`img/${nombreArchivo}`)
				.putString(archivo.img,'base64', {contentType: 'image/jpeg'});

				uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,

					()=>{},
					(error)=>{

						console.log("ERROR EN LA CARGA-----> "+JSON.stringify(error));
						this.mostratToast("Error al cargar la imagen");
						reject();
					},
					()=>{
						//TODO BIEN
						console.log("Archivo subido------>");
						uploadTask.snapshot.ref.getDownloadURL().then(urlImage => {
   								this.crear_post(archivo.titulo, urlImage, nombreArchivo);
						    	this.mostratToast("Imagen cargada correctamente");
						}).catch((error) => {
						   	console.log(error);
						});
						
						
						
						resolve();
					}


				)  			

  		});

  		return promesa;
  	}

  	private crear_post(titulo: string, url:string, nombreArchivo:string){

  		let post: ArchivoSubir={
  			img:url,
  			titulo:titulo,
  			key:nombreArchivo
  		};

  		console.log("POST---->"+JSON.stringify(post));

  		//this.afDB.list('/post').push(post);
  		this.afDB.object(`/post/${nombreArchivo}`).update(post);
  		this.imagenes.push(post);
  	}

  	mostratToast(mensaje:string) {
    	this.toastCtrl.create({
      		message: mensaje,
      		duration: 3000
    	}).present();
  	}
}

interface ArchivoSubir{
	titulo:string;
	img:string;
	key?:string;
}