export type RootStackParamList = {
  Start: undefined;
  LoginAccount: undefined;
  CreateAccount: undefined;
  
  Casos: { user: { name: string, email: string; id: string } };
  RecusedCaso: { user: { name: string, email: string; id: string }; caso: string };
  CreateCaso: { user: { name: string, email: string; id: string } };
  Documents: { user: { name: string, email: string; id: string }; caso: string };
  NewDocument: { user: { name: string, email: string; id: string }; caso: string };
  Send: { user: { name: string, email: string; id: string } };

  CasosList: { user: { name: string, email: string; id: string } };
  LawyerCases: { user: { name: string, email: string; id: string } };
  CaseInformations: { user: { name: string, email: string; id: string }; caso: string };
  CaseDocuments: { user: { name: string, email: string; id: string }; caso: string };
};