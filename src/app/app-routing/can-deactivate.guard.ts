import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router/src/router_state';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component:CanComponentDeactivate,
    currentRoute:ActivatedRouteSnapshot,
    currentState:RouterStateSnapshot,
    nextState?:RouterStateSnapshot
  ):Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
} 
export interface CanComponentDeactivate { 
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean
}