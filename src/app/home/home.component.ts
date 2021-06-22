import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import { DEFAULT_LAT, DEFAULT_LNG} from '../app.consts';
import {GeoPositionRes} from '../model/geo-position';
import {DailyForecast, FiveDaysForecast} from '../model/5-days-forecast';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap, takeUntil} from 'rxjs/operators';
import {AutoCompleteSuggestions} from '../model/auto-complete-suggestions';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  autoCompleteInput = new Subject();
  autoCompleteValue;
  autoCompletedSuggestions: AutoCompleteSuggestions[];
  cityName: string;
  headLine: string;
  forecasts: DailyForecast[];
  favState;
  selectedKey: any;

  constructor(protected appService: AppService, protected weatherService: WeatherService) {
  }

  ngUnSubscribe: Subject<void> = new Subject<void>();

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        this.appService.getGeoPosition(latitude, longitude).subscribe((data: GeoPositionRes) => {
          this.handleInitPosition(data);
        });
      });
    } else {
      this.appService.getGeoPosition(DEFAULT_LAT, DEFAULT_LNG).subscribe((data: GeoPositionRes) => {
        this.handleInitPosition(data);
      });
    }


    this.autoCompleteInput
      .pipe(
        filter((data: string) => data.length > 0),
        takeUntil(this.ngUnSubscribe),
        debounceTime(300),
        switchMap((data: string) => {
          return this.appService.getAutoComplete(data);
        })
      )
      .subscribe((suggestions: AutoCompleteSuggestions[]) => {
        this.autoCompletedSuggestions = suggestions;
      });
  }


  selectSuggestion(suggestion: AutoCompleteSuggestions) {
    this.cityName          = `${suggestion.LocalizedName},${suggestion.Country.LocalizedName}`;
    this.autoCompleteValue = this.cityName;
    this.getFiveDays(suggestion.Key);
    this.autoCompletedSuggestions = null;
  }


  private handleInitPosition(geoPositionRes: GeoPositionRes) {
    this.cityName    = `${geoPositionRes.ParentCity.EnglishName},${geoPositionRes.Country.EnglishName}`;
    this.getFiveDays(geoPositionRes.Key);
  }


  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }


  getFiveDays(key) {
    this.selectedKey = key;
    this.appService.get5DaysOfForecasts(key).subscribe((fiveDaysForecastData: FiveDaysForecast) => {
      this.headLine  = fiveDaysForecastData.Headline.Text;
      this.forecasts = fiveDaysForecastData.DailyForecasts;
    });
  }


  
}
