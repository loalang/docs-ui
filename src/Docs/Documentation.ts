export interface Documentation {
  classes: Record<string, ClassDoc>;
}

export interface ClassDoc {
  name: QualifiedNameDoc;
  superClasses: string[];
  subClasses: string[];
  behaviours: Record<string, BehaviourDoc>;
}

export interface QualifiedNameDoc {
  name: string;
  namespace: string;
}

export interface BehaviourDoc {
  selector: string;
}
