import {
  Component,
  ComponentRef,
  inject,
  inputBinding,
  OnDestroy,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
  heroPlus,
} from '@ng-icons/heroicons/outline';
import { passiveConditionActivation } from '../../select-options/passive-condition-activation';
import { effectDuration } from '../../select-options/effect-duration';
import { CardComponent } from '../../shared/card/card.component';
import { Links } from '../../select-options/links';
import { categories } from '../../select-options/categories';
import { catchError, EMPTY, Subject, take } from 'rxjs';
import { CardForm } from '../../shared/models/form-interface';

import { CardService } from '../../services/card.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ErrorToastService } from '../../services/error-toast.service';
import generateCard from '../../helpers/generate-card';
import { CardFormComponent } from '../card-form/card-form.component';
import { UbButtonDirective } from '~/components/ui/button';

@Component({
  selector: 'app-create-card-form',
  imports: [
    ReactiveFormsModule,
    LoaderComponent,
    CardFormComponent,
    UbButtonDirective,
  ],
  templateUrl: './create-card-form.component.html',
  styleUrl: './create-card-form.component.css',
  viewProviders: [
    provideIcons({
      heroArchiveBoxXMark,
      heroArrowLeft,
      heroArrowLongRight,
      heroPlus,
    }),
  ],
})
export class CreateCardFormComponent implements OnDestroy {
  readonly #authService = inject(AuthService);
  readonly #cardService = inject(CardService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #router = inject(Router);
  isFormUntouched = signal(true);
  isLoading = signal(false);
  passiveConditionActivation = passiveConditionActivation;
  effectDuration = effectDuration;
  categories = categories;
  links = Links;
  isFirstPartShow = signal(true);
  title = signal('Card Details');
  canQuit$: Subject<boolean> = new Subject<boolean>();
  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;
  cardForm = new FormGroup({});

  onSubmit() {
    // Retrieve the nested card form
    const nestedCardForm = this.cardForm.get(
      'cardForm'
    ) as FormGroup<CardForm> | null;

    // If the nested card form is not found, return
    if (!nestedCardForm) {
      return;
    }

    // Get the raw value of the nested card form
    const data = nestedCardForm.getRawValue();

    // If the nested card form is valid, generate the card
    if (nestedCardForm.valid) {
      const { characterInfo, passiveDetails, superAttackInfo } =
        generateCard(nestedCardForm);
      if (this.componentRefs) {
        this.componentRefs.destroy();
      }
      if (this.#authService.user() !== null) {
        this.isLoading.set(true);
        this.#cardService
          .createCard({
            creatorName: this.#authService.user()?.displayName ?? '',
            creatorId: this.#authService.user()?.uid ?? '',
            cardName: data.cardName,
            characterInfo: characterInfo(),
            passiveDetails: passiveDetails(),
            superAttackInfo: superAttackInfo(),
          })
          .pipe(
            take(1),
            catchError(() => {
              this.isLoading.set(false);
              this.#errorToastService.showToast(
                'An error occurred while creating the card'
              );
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.#router.navigate(['/card', res.id]);
            this.isLoading.set(false);
          });
      } else {
        const componentRef = this.card().createComponent(CardComponent, {
          bindings: [
            inputBinding('characterInfo', characterInfo),
            inputBinding('passiveDetails', passiveDetails),
            inputBinding('superAttackInfo', superAttackInfo),
          ],
        });

        this.componentRefs = componentRef;
      }
    }
  }

  ngOnDestroy() {
    this.componentRefs?.destroy();
  }
}
