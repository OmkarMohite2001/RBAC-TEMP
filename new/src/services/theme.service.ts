import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

enum ThemeType {
  Dark = 'dark',
  Default = 'default',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = ThemeType.Default;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private reverseTheme(theme: string): ThemeType {
    return theme === ThemeType.Dark ? ThemeType.Default : ThemeType.Dark;
  }

  private removeUnusedTheme(theme: ThemeType): void {
    this.renderer.removeClass(document.documentElement, theme);
    try {
      const removedThemeStyle = this.renderer.selectRootElement(
        `#${theme}`,
        true
      );
      if (removedThemeStyle) {
        this.renderer.removeChild(document.head, removedThemeStyle);
      }
    } catch {
      //console.warn('')
    }
  }

  private loadCss(href: string, id: string): Observable<Event> {
    return new Observable<Event>(observer => {
      const style = this.renderer.createElement('link');
      this.renderer.setAttribute(style, 'rel', 'stylesheet');
      this.renderer.setAttribute(style, 'href', href);
      this.renderer.setAttribute(style, 'id', id);

      style.onload = (event: Event) => {
        observer.next(event);
        observer.complete();
      };
      style.onerror = () => {
        observer.error();
      };
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink && faviconLink.parentNode) {
        this.renderer.insertBefore(
          faviconLink.parentNode,
          style,
          faviconLink.nextSibling
        );
      } else {
        this.renderer.appendChild(document.head, style);
      }
    });
  }

  public loadTheme(firstLoad = true): Observable<Event> {
    const theme = this.currentTheme;
    if (firstLoad) {
      this.renderer.addClass(document.documentElement, theme);
    }
    return this.loadCss(`${theme}.css`, theme).pipe(
      map((event: Event) => {
        if (!firstLoad) {
          this.renderer.addClass(document.documentElement, theme);
        }
        this.removeUnusedTheme(this.reverseTheme(theme));
        return event;
      }),
      catchError(error => {
        throw new Error(`Failed to load theme: ${error}`);
      })
    );
  }

  public toggleTheme(): Observable<Event> {
    this.currentTheme = this.reverseTheme(this.currentTheme);
    return this.loadTheme(false);
  }
}
