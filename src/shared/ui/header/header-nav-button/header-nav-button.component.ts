import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type HeaderNavIcon = 'plus' | 'cards' | 'heart' | 'logout';

/**
 * Header navigation link matching the logo: Bungee, cut corners, orange icon,
 * yellow border when hovered or when it is the current page.
 */
@Component({
  selector: 'app-header-nav-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="navigateTo()"
      [routerLinkActive]="highlightActive() ? 'is-active' : ''"
      class="dokkan-btn"
      [class.dokkan-btn--block]="isMobileVersion()"
      [class.dokkan-btn--danger]="icon() === 'logout'"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
        @switch (icon()) {
          @case ('plus') {
            <path d="M12 5v14M5 12h14" />
          }
          @case ('cards') {
            <rect x="8" y="4" width="11" height="15" rx="1.5" />
            <path d="M5 8v11a2 2 0 0 0 2 2h8" />
          }
          @case ('heart') {
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          }
          @case ('logout') {
            <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 16l4-4-4-4M20 12H10" />
          }
        }
      </svg>
      {{ text() }}
    </a>
  `,
  host: {
    '[class.block]': 'isMobileVersion()',
  },
})
export class HeaderNavButtonComponent {
  text = input.required<string>();
  icon = input.required<HeaderNavIcon>();
  navigateTo = input.required<string[]>();
  isMobileVersion = input(false);
  // Off for links that are actions rather than pages (e.g. Logout)
  highlightActive = input(true);
}
