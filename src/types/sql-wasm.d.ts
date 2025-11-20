declare module "sql.js/dist/sql-wasm.wasm?url" {
  const value: string;
  export default value;
}

declare module "*.wasm?url" {
  const src: string;
  export default src;
}
