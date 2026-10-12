interface TeacherEquityAuth {
  auth: unknown;
  onAuthStateChanged: (auth: unknown, callback: (user: unknown) => void) => () => void;
  signInWithEmailAndPassword: (auth: unknown, email: string, password: string) => Promise<unknown>;
  signOut: (auth: unknown) => Promise<void>;
}

declare global {
  interface Window {
    teacherEquityAuth?: TeacherEquityAuth;
  }
}

export {};
