export interface IConfig {
  bruh: string;
  port: string;
  env?: string;
  api_base: string;
  mongo_url: string;
  mongo_host: string;
  isDev?: boolean;
  isProd?: boolean;
}
