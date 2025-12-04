import { firstValueFrom } from 'rxjs';
import { expect, describe, beforeEach, it } from 'vitest';
import { GameDataService } from './game-data.service';
import { TestBed } from '@angular/core/testing';

describe('GameDataService', () => {
  let service: GameDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('categories$', () => {
    it('should load categories from JSON', async () => {
      const categories = await firstValueFrom(service.categories$);

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have categories with correct structure', async () => {
      const categories = await firstValueFrom(service.categories$);

      categories.forEach((category) => {
        expect(category.value).toBeDefined();
        expect(category.categoryName).toBeDefined();
        expect(typeof category.value).toBe('number');
        expect(typeof category.categoryName).toBe('string');
      });
    });

    it('should contain expected categories', async () => {
      const categories = await firstValueFrom(service.categories$);

      const categoryNames = categories.map((cat) => cat.categoryName);
      expect(categoryNames).toContain('Fusion');
      expect(categoryNames).toContain('Shadow Dragon Saga');
      expect(categoryNames).toContain('World Tournament');
    });

    it('should have unique values for categories', async () => {
      const categories = await firstValueFrom(service.categories$);

      const values = categories.map((cat) => cat.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should cache categories on multiple subscriptions', async () => {
      const categories1 = await firstValueFrom(service.categories$);
      const categories2 = await firstValueFrom(service.categories$);

      expect(categories1).toBe(categories2); // Même référence grâce à shareReplay
      expect(categories1.length).toBe(categories2.length);
    });

    it('should have at least 96 categories', async () => {
      const categories = await firstValueFrom(service.categories$);

      expect(categories.length).toBeGreaterThanOrEqual(96);
    });
  });

  describe('categories signal', () => {
    it('should have initial empty array', () => {
      const initialCategories = service.categories();
      expect(initialCategories).toEqual([]);
    });

    it('should be populated after categories$ emits', async () => {
      // Attendre que les données soient chargées
      await firstValueFrom(service.categories$);

      // Attendre un tick pour que le signal se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 0));

      const categories = service.categories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have same data as categories$ observable', async () => {
      const observableCategories = await firstValueFrom(service.categories$);

      // Attendre que le signal se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 0));

      const signalCategories = service.categories();
      expect(signalCategories.length).toBe(observableCategories.length);
      expect(signalCategories).toEqual(observableCategories);
    });

    it('should have correct structure in signal', async () => {
      await firstValueFrom(service.categories$);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const categories = service.categories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        expect(firstCategory.value).toBeDefined();
        expect(firstCategory.categoryName).toBeDefined();
        expect(typeof firstCategory.value).toBe('number');
        expect(typeof firstCategory.categoryName).toBe('string');
      }
    });
  });

  describe('links$', () => {
    it('should load links from JSON', async () => {
      const links = await firstValueFrom(service.links$);

      expect(links).toBeDefined();
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have links with correct structure', async () => {
      const links = await firstValueFrom(service.links$);

      links.forEach((link) => {
        expect(link.value).toBeDefined();
        expect(link.linkName).toBeDefined();
        expect(link.description).toBeDefined();
        expect(typeof link.value).toBe('number');
        expect(typeof link.linkName).toBe('string');
        expect(typeof link.description).toBe('string');
      });
    });

    it('should contain expected links', async () => {
      const links = await firstValueFrom(service.links$);

      const linkNames = links.map((link) => link.linkName);
      expect(linkNames).toContain('High Compatibility');
      expect(linkNames).toContain('Courage');
      expect(linkNames).toContain('The Students');
    });

    it('should have unique values for links', async () => {
      const links = await firstValueFrom(service.links$);

      const values = links.map((link) => link.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should cache links on multiple subscriptions', async () => {
      const links1 = await firstValueFrom(service.links$);
      const links2 = await firstValueFrom(service.links$);

      expect(links1).toBe(links2); // Même référence grâce à shareReplay
      expect(links1.length).toBe(links2.length);
    });

    it('should have at least 130 links', async () => {
      const links = await firstValueFrom(service.links$);

      expect(links.length).toBeGreaterThanOrEqual(130);
    });
  });

  describe('links signal', () => {
    it('should have initial empty array', () => {
      const initialLinks = service.links();
      expect(initialLinks).toEqual([]);
    });

    it('should be populated after links$ emits', async () => {
      // Attendre que les données soient chargées
      await firstValueFrom(service.links$);

      // Attendre un tick pour que le signal se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 0));

      const links = service.links();
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have same data as links$ observable', async () => {
      const observableLinks = await firstValueFrom(service.links$);

      // Attendre que le signal se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 0));

      const signalLinks = service.links();
      expect(signalLinks.length).toBe(observableLinks.length);
      expect(signalLinks).toEqual(observableLinks);
    });

    it('should have correct structure in signal', async () => {
      await firstValueFrom(service.links$);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const links = service.links();
      if (links.length > 0) {
        const firstLink = links[0];
        expect(firstLink.value).toBeDefined();
        expect(firstLink.linkName).toBeDefined();
        expect(firstLink.description).toBeDefined();
        expect(typeof firstLink.value).toBe('number');
        expect(typeof firstLink.linkName).toBe('string');
        expect(typeof firstLink.description).toBe('string');
      }
    });
  });
});
