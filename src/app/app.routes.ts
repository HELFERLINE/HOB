import {
    Route,
    Routes,
    UrlMatcher,
    UrlMatchResult,
    UrlSegment,
    UrlSegmentGroup,
  } from '@angular/router';
  
import { AppUrls } from './app.urls';
import { StartPageComponent } from './components/Installationsservice/start-page/start-page.component';
import { SuccessVideoComponent } from './components/success-video/success-video.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { DsgvoComponent } from './components/dsgvo/dsgvo.component';
  
  const LOWERCASE_ROUTE_MATCH: boolean = true;
  const LOWERCASE_FORWARD_ROUTE_DATA: boolean = false;
  
  const CaseInsensitiveMatcher = (path: string): UrlMatcher => {
    return ((p) => {
      return (
        segments: UrlSegment[],
        segmentGroup: UrlSegmentGroup,
        route: Route
      ) => {
        return _caseInsensitiveMatcherProcessor(p, segments, segmentGroup, route);
      };
    })(path);
  };
  
  const _caseInsensitiveMatcherProcessor = (
    path: string,
    segments: UrlSegment[],
    segmentGroup: UrlSegmentGroup,
    route: Route
  ): UrlMatchResult | null => {
    const pathSegments = path.split(/\/+/);
    if (
      pathSegments.length > segments.length ||
      (pathSegments.length !== segments.length && route.pathMatch === 'full')
    ) {
      return null;
    }
    const consumed: UrlSegment[] = [];
    const posParams: { [name: string]: UrlSegment } = {};
    for (let index = 0; index < pathSegments.length; ++index) {
      const segment: UrlSegment = segments[index];
      const segmentString: string = segment.toString();
      const pathSegment = pathSegments[index];
      if (pathSegment.startsWith(':')) {
        posParams[pathSegment.slice(1)] = segment;
        consumed.push(segment);
      } else if (
        pathSegment == '**' ||
        (LOWERCASE_ROUTE_MATCH &&
          segmentString.toLowerCase() === pathSegment.toLowerCase()) ||
        (!LOWERCASE_ROUTE_MATCH && segmentString === pathSegment)
      ) {
        consumed.push(segment);
      } else {
        break;
      }
    }
    return { consumed, posParams };
  };
  
  export const RoutesConfig: Routes = [
    { path: '', redirectTo: AppUrls.InstallationService, pathMatch: 'full' },
    {
      matcher: CaseInsensitiveMatcher(AppUrls.InstallationService),
      component: StartPageComponent,
    },
    {
      matcher: CaseInsensitiveMatcher(AppUrls.SuccessPage),
      component: SuccessVideoComponent,
    },
    {
      matcher: CaseInsensitiveMatcher(AppUrls.imprint),
      component: ImprintComponent,
    },
    {
      matcher: CaseInsensitiveMatcher(AppUrls.dsgvo),
      component: DsgvoComponent,
    },
    // {
    //   matcher: CaseInsensitiveMatcher(AppUrls.InstallationServiceB2B),
    //   component: StartPageComponent,
    // },
    { path: '**', redirectTo: AppUrls.InstallationService, pathMatch: 'full' },
  ];