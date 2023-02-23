import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { kodAnimations } from 'src/app/services/animations';
import { KodCardFace } from 'src/app/components/card/card.types';

@Component({
    selector     : 'kod-card',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : kodAnimations,
    exportAs     : 'kodCard'
})
export class KodCardComponent implements OnChanges
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_expanded: BooleanInput;
    static ngAcceptInputType_flippable: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() expanded: boolean = false;
    @Input() face: KodCardFace = 'front';
    @Input() flippable: boolean = false;

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any
    {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'kod-card-expanded'  : this.expanded,
            'kod-card-face-back' : this.flippable && this.face === 'back',
            'kod-card-face-front': this.flippable && this.face === 'front',
            'kod-card-flippable' : this.flippable
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Expanded
        if ( 'expanded' in changes )
        {
            // Coerce the value to a boolean
          this.expanded = coerceBooleanProperty(changes['expanded'].currentValue);
        }

        // Flippable
        if ( 'flippable' in changes )
        {
            // Coerce the value to a boolean
            this.flippable = coerceBooleanProperty(changes['flippable'].currentValue);
        }
    }
}
