declare module '*.module.css' {
  const classes: { 
    expoLogoBackground: string;
    [key: string]: string 
  };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}