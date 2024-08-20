import { Theme } from "./ui";

export type CookieNames = 'theme' | '...';

export interface CookieData {
  [key: string]: string
  'theme': Theme
}