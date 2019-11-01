import { NgModule } from '@angular/core';
import { PlaceHolderPipe } from './place-holder/place-holder';
@NgModule({
	declarations: [PlaceHolderPipe,
    PlaceHolderPipe],
	imports: [],
	exports: [PlaceHolderPipe,
    PlaceHolderPipe]
})
export class PipesModule {}
