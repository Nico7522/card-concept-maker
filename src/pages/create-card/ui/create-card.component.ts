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

import { catchError, EMPTY, Subject, take } from 'rxjs';

import { Router } from '@angular/router';

import { UbButtonDirective } from '../../../../components/ui/button';
import { LoaderComponent } from '~/src/shared/ui/loader/loader.component';
import { CardFormComponent } from '~/src/widgets/ui/card-form/card-form.component';
import { passiveConditionActivation } from '~/src/app/select-options/passive-condition-activation';
import { effectDuration } from '~/src/app/select-options/effect-duration';
import { categories } from '~/src/app/select-options/categories';
import { Links } from '~/src/app/select-options/links';
import generateCard from '~/src/app/helpers/generate-card';
import { CardForm } from '~/src/widgets/model/card-form-interface';
import { CardComponent } from '~/src/shared/ui/card/card.component';
import { AuthService } from '~/src/shared/api/auth-service/auth.service';
import { ErrorToastService } from '~/src/shared/api/error-toast-service/error-toast.service';
import { CreateCardService } from '../api/create-card.service';

@Component({
  selector: 'app-create-card-form',
  imports: [
    ReactiveFormsModule,
    LoaderComponent,
    CardFormComponent,
    UbButtonDirective,
  ],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css',
  viewProviders: [
    provideIcons({
      heroArchiveBoxXMark,
      heroArrowLeft,
      heroArrowLongRight,
      heroPlus,
    }),
  ],
})
export class CreateCardComponent implements OnDestroy {
  readonly #authService = inject(AuthService);
  readonly #createCardService = inject(CreateCardService);
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

        this.#createCardService
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
