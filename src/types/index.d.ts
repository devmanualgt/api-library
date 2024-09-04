declare namespace NodeJS {
  interface ProcessEnv {
    SECRET_KEY_AUTH: string;
    HASH_SALT: number;
    HOST_DB: string;
    PORT_DB: string;
    DATABASE_DB: string;
    USER_DB: string;
    PASSWORD_DB: string;
  }
}
