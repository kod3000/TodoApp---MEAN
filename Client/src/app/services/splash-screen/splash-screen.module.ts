import { NgModule } from '@angular/core';
import { SimpleSplashScreenService } from 'src/app/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [
      SimpleSplashScreenService
    ]
})
export class KodSplashScreenModule
{
    /**
     * Constructor
     */
    constructor(private _kodSplashScreenService: SimpleSplashScreenService)
    {
    }
}
