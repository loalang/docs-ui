export interface Documentation {
  classes: Record<string, ClassDoc>;
}

export interface ClassDoc {
  name: QualifiedNameDoc;
  description: TextDoc;
  superTypes: TypeDoc[];
  subClasses: string[];
  behaviours: Record<string, BehaviourDoc>;
}

export interface QualifiedNameDoc {
  name: string;
  namespace: string;
}

export interface BehaviourDoc {
  selector: string;
  description: TextDoc;
  signature: SignatureDoc;
}

export type SignatureDoc =
  | UnarySignatureDoc
  | BinarySignatureDoc
  | KeywordSignatureDoc;

export interface UnarySignatureDoc {
  __type: "UNARY";
  symbol: string;
  returnType: TypeDoc;
}

export interface BinarySignatureDoc {
  __type: "BINARY";
  operator: string;
  operandType: TypeDoc;
  returnType: TypeDoc;
}

export interface KeywordSignatureDoc {
  __type: "KEYWORD";
  parameters: {
    keyword: string;
    type: TypeDoc;
  }[];
  returnType: TypeDoc;
}

export type TypeDoc = ReferenceTypeDoc;

export interface ReferenceTypeDoc {
  __type: "REFERENCE";
  class: string;
  arguments: TypeDoc[];
}

export interface TextDoc {
  blocks: DocBlock[];
}

export type DocBlock = ParagraphDocBlock;

export interface ParagraphDocBlock {
  __type: "PARAGRAPH";
  elements: DocElement[];
}

export type DocElement =
  | TextDocElement
  | BoldDocElement
  | ItalicDocElement
  | LinkDocElement;

export interface TextDocElement {
  __type: "TEXT";
  value: string;
}

export interface BoldDocElement {
  __type: "BOLD";
  value: string;
}

export interface ItalicDocElement {
  __type: "ITALIC";
  value: string;
}

export interface LinkDocElement {
  __type: "LINK";
  value: string;
  to: string;
}
