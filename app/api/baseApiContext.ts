import { APIRequestContext } from "@playwright/test";
import path from "path";
import * as fs from "fs";

export abstract class BaseApiContext {
  constructor(protected request: APIRequestContext) {}

  getSessionCookie(): string {
    const userJsonPath = path.resolve(
      __dirname,
      "../../playwright/.auth/user.json"
    );
    const userData = JSON.parse(fs.readFileSync(userJsonPath, "utf-8"));

    interface Cookie {
      name: string;
      value: string;
      [key: string]: unknown;
    }
    const cookie = (userData.cookies as Cookie[]).find(
      (c: Cookie) => c.name === "orangehrm"
    );
    return cookie ? `${cookie.name}=${cookie.value}` : "";
  }

  getHeaders(sessionCookie: string) {
    return {
      "Content-Type": "application/json",
      Cookie: sessionCookie,
    };
  }
}
