import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse } from "@angular/common/http";

const maxAge: number = 0;
@Injectable()
export class RequestCacheService {
  cache: Map<string, any> = new Map<string, any>();

  constructor() {}

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url: string = req.urlWithParams;
    const cached: any = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired: boolean = cached.lastRead < Date.now() - maxAge;
    const expired: string = isExpired ? "expired" : "";

    if (isExpired) {
      return undefined;
    }

    return cached.res;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const url: string = req.url;
    const entry: object = { url, res, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired: number = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}
