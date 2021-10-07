class DefaultService {
  constructor() {}

  hello(): string {
    return '<h1>Hello from the TypeScript world!</h1>';
  }

  apiCheck(): string {
    return '<h1>API RUNNING!</h1>';
  }

  notFound(): string {
    return 'Page NOT-FOUND 404: This will be developed soon. Please contact admin if you need help';
  }
}

export default DefaultService