
export interface Letter {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface Variable {
    tag: string;
    description: string;
}

export enum View {
  Letters = 'LETTERS',
  Templates = 'TEMPLATES',
}
