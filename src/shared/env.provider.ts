export const initSwagger = () =>
  !process.env.NODE_ENV ? false : process.env.NODE_ENV.includes('dev');
