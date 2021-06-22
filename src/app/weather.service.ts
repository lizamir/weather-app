import {Injectable} from '@angular/core';
import {ObservableStore} from '@codewithdan/observable-store';
import {AppService} from './app.service';
import {map} from 'rxjs/operators';
import {CurrentConditions} from './model/current-conditions';


@Injectable({
  providedIn: 'root'
})
export class WeatherService extends ObservableStore<{}> {

  constructor(protected appService: AppService) {

    super({trackStateHistory: true});

  }

  add(favCity) {
    const state = this.getState() || {};

    this.appService.getCurrentConditions(favCity.key)
      .pipe(map((data) => data[0]))
      .subscribe((data: CurrentConditions) => {
          state[favCity.key] = {
            title: favCity.cityName,
            text: data.WeatherText,
            temperature: data.Temperature,
            icon: data.WeatherIcon
          };
          console.log(state);
          this.setState(state,
            'add_favCity');
        }
      );


  }

  remove(favCity) {
    const state = this.getState() || {};
    delete state[favCity.key];
    this.setState(state,
      'remove_favCity');
  }

  get() {
    return this.getState() || {};
  }

}
