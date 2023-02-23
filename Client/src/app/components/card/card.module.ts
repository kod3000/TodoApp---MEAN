import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KodCardComponent } from 'src/app/components/card/card.component';

@NgModule({
    declarations: [
        KodCardComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        KodCardComponent
    ]
})
export class KodCardModule
{
}
