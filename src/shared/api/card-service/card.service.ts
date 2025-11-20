import {
  inject,
  Injectable,
  Injector,
  NgZone,
  runInInjectionContext,
} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  docData,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map } from 'rxjs';
import runAsyncInInjectionContext from '~/src/app/helpers/firebase-helper';
import { Card } from '~/src/shared/model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  firestore = inject(Firestore);

  zone = inject(NgZone);
  injector = inject(Injector);
  cardsCollection = collection(this.firestore, 'cards');
  constructor() {}
}
