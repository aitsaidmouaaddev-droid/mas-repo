export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateIdentityInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  identityName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateQcmAnswerInput = {
  isCorrect: Scalars['Boolean']['input'];
  questionId: Scalars['String']['input'];
  selectedOption: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
  timeSpentMs?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateQcmModuleInput = {
  label: Scalars['String']['input'];
  sortOrder: Scalars['Int']['input'];
};

export type CreateQcmProgressInput = {
  moduleId: Scalars['String']['input'];
};

export type CreateQcmQuestionInput = {
  data: QcmQuestionDataInput;
  difficulty: Scalars['String']['input'];
  moduleId: Scalars['String']['input'];
  sortOrder: Scalars['Int']['input'];
  type: Scalars['String']['input'];
};

export type CreateQcmSessionInput = {
  moduleId: Scalars['String']['input'];
  totalQuestions: Scalars['Float']['input'];
};

export type CreateTdtChallengeInput = {
  category: Scalars['String']['input'];
  data: TdtChallengeDataInput;
  difficulty: Scalars['String']['input'];
  sortOrder: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateTdtProgressInput = {
  challengeId: Scalars['String']['input'];
};

export type CreateTdtSessionInput = {
  challengeId: Scalars['String']['input'];
};

export type CreateTdtSubmissionInput = {
  code: Scalars['String']['input'];
  failedTests: Scalars['Int']['input'];
  logs?: InputMaybe<Scalars['String']['input']>;
  passedTests: Scalars['Int']['input'];
  sessionId: Scalars['ID']['input'];
  totalTests: Scalars['Int']['input'];
};

export type CreateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  identity: CreateIdentityInput;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type Identity = {
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identityName?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export type IdentityCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<Identity>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type IdentityPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<Identity>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  accessToken: Scalars['String']['output'];
  identity: Identity;
  refreshToken: Scalars['String']['output'];
};

export type Mutation = {
  createIdentity: Identity;
  createQcmAnswer: QcmAnswer;
  createQcmModule: QcmModule;
  createQcmProgress: QcmProgress;
  createQcmQuestion: QcmQuestion;
  createQcmSession: QcmSession;
  createTdtChallenge: TdtChallenge;
  createTdtProgress: TdtProgress;
  createTdtSession: TdtSession;
  createTdtSubmission: TdtSubmission;
  createUser: User;
  deleteIdentity: Scalars['Boolean']['output'];
  deleteQcmAnswer: Scalars['Boolean']['output'];
  deleteQcmModule: Scalars['Boolean']['output'];
  deleteQcmProgress: Scalars['Boolean']['output'];
  deleteQcmQuestion: Scalars['Boolean']['output'];
  deleteQcmSession: Scalars['Boolean']['output'];
  deleteTdtChallenge: Scalars['Boolean']['output'];
  deleteTdtProgress: Scalars['Boolean']['output'];
  deleteTdtSession: Scalars['Boolean']['output'];
  deleteTdtSubmission: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  logoutAll: Scalars['Boolean']['output'];
  refreshToken: LoginResponse;
  register: LoginResponse;
  resetPassword: Scalars['Boolean']['output'];
  updateIdentity: Identity;
  updateQcmAnswer: QcmAnswer;
  updateQcmModule: QcmModule;
  updateQcmProgress: QcmProgress;
  updateQcmQuestion: QcmQuestion;
  updateQcmSession: QcmSession;
  updateTdtChallenge: TdtChallenge;
  updateTdtProgress: TdtProgress;
  updateTdtSession: TdtSession;
  updateTdtSubmission: TdtSubmission;
  updateUser: User;
};


export type MutationCreateIdentityArgs = {
  input: CreateIdentityInput;
};


export type MutationCreateQcmAnswerArgs = {
  input: CreateQcmAnswerInput;
};


export type MutationCreateQcmModuleArgs = {
  input: CreateQcmModuleInput;
};


export type MutationCreateQcmProgressArgs = {
  input: CreateQcmProgressInput;
};


export type MutationCreateQcmQuestionArgs = {
  input: CreateQcmQuestionInput;
};


export type MutationCreateQcmSessionArgs = {
  input: CreateQcmSessionInput;
};


export type MutationCreateTdtChallengeArgs = {
  input: CreateTdtChallengeInput;
};


export type MutationCreateTdtProgressArgs = {
  input: CreateTdtProgressInput;
};


export type MutationCreateTdtSessionArgs = {
  input: CreateTdtSessionInput;
};


export type MutationCreateTdtSubmissionArgs = {
  input: CreateTdtSubmissionInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteIdentityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQcmAnswerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQcmModuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQcmProgressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQcmQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQcmSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTdtChallengeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTdtProgressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTdtSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTdtSubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationUpdateIdentityArgs = {
  input: UpdateIdentityInput;
};


export type MutationUpdateQcmAnswerArgs = {
  input: UpdateQcmAnswerInput;
};


export type MutationUpdateQcmModuleArgs = {
  input: UpdateQcmModuleInput;
};


export type MutationUpdateQcmProgressArgs = {
  input: UpdateQcmProgressInput;
};


export type MutationUpdateQcmQuestionArgs = {
  input: UpdateQcmQuestionInput;
};


export type MutationUpdateQcmSessionArgs = {
  input: UpdateQcmSessionInput;
};


export type MutationUpdateTdtChallengeArgs = {
  input: UpdateTdtChallengeInput;
};


export type MutationUpdateTdtProgressArgs = {
  input: UpdateTdtProgressInput;
};


export type MutationUpdateTdtSessionArgs = {
  input: UpdateTdtSessionInput;
};


export type MutationUpdateTdtSubmissionArgs = {
  input: UpdateTdtSubmissionInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type QcmAnswer = {
  answeredAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCorrect: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  questionId: Scalars['String']['output'];
  selectedOption: Scalars['String']['output'];
  sessionId: Scalars['ID']['output'];
  timeSpentMs?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type QcmAnswerCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<QcmAnswer>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type QcmAnswerPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<QcmAnswer>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type QcmModule = {
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type QcmModuleCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<QcmModule>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type QcmModulePage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<QcmModule>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type QcmProgress = {
  attemptsCount: Scalars['Float']['output'];
  bestScore?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstCompletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  lastSessionId?: Maybe<Scalars['ID']['output']>;
  moduleId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type QcmProgressCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<QcmProgress>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type QcmProgressPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<QcmProgress>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type QcmQuestion = {
  createdAt: Scalars['DateTime']['output'];
  data: QcmQuestionData;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  difficulty: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  moduleId: Scalars['ID']['output'];
  sortOrder: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type QcmQuestionCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<QcmQuestion>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type QcmQuestionData = {
  answer: Scalars['String']['output'];
  choices: Array<Scalars['String']['output']>;
  docs?: Maybe<Scalars['String']['output']>;
  explanation?: Maybe<Scalars['String']['output']>;
  question: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
};

export type QcmQuestionDataInput = {
  answer: Scalars['String']['input'];
  choices: Array<Scalars['String']['input']>;
  docs?: InputMaybe<Scalars['String']['input']>;
  explanation?: InputMaybe<Scalars['String']['input']>;
  question: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type QcmQuestionPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<QcmQuestion>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type QcmSession = {
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  moduleId: Scalars['String']['output'];
  score?: Maybe<Scalars['Float']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: QcmSessionStatus;
  totalQuestions: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type QcmSessionCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<QcmSession>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type QcmSessionPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<QcmSession>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum QcmSessionStatus {
  Abandoned = 'Abandoned',
  Completed = 'Completed',
  InProgress = 'InProgress'
}

export type Query = {
  findAllIdentity: Array<Identity>;
  findAllQcmAnswer: Array<QcmAnswer>;
  findAllQcmModule: Array<QcmModule>;
  findAllQcmProgress: Array<QcmProgress>;
  findAllQcmQuestion: Array<QcmQuestion>;
  findAllQcmSession: Array<QcmSession>;
  findAllTdtChallenge: Array<TdtChallenge>;
  findAllTdtProgress: Array<TdtProgress>;
  findAllTdtSession: Array<TdtSession>;
  findAllTdtSubmission: Array<TdtSubmission>;
  findAllUser: Array<User>;
  findCursorIdentity: IdentityCursorPage;
  findCursorQcmAnswer: QcmAnswerCursorPage;
  findCursorQcmModule: QcmModuleCursorPage;
  findCursorQcmProgress: QcmProgressCursorPage;
  findCursorQcmQuestion: QcmQuestionCursorPage;
  findCursorQcmSession: QcmSessionCursorPage;
  findCursorTdtChallenge: TdtChallengeCursorPage;
  findCursorTdtProgress: TdtProgressCursorPage;
  findCursorTdtSession: TdtSessionCursorPage;
  findCursorTdtSubmission: TdtSubmissionCursorPage;
  findCursorUser: UserCursorPage;
  findOneIdentity?: Maybe<Identity>;
  findOneQcmAnswer?: Maybe<QcmAnswer>;
  findOneQcmModule?: Maybe<QcmModule>;
  findOneQcmProgress?: Maybe<QcmProgress>;
  findOneQcmQuestion?: Maybe<QcmQuestion>;
  findOneQcmSession?: Maybe<QcmSession>;
  findOneTdtChallenge?: Maybe<TdtChallenge>;
  findOneTdtProgress?: Maybe<TdtProgress>;
  findOneTdtSession?: Maybe<TdtSession>;
  findOneTdtSubmission?: Maybe<TdtSubmission>;
  findOneUser?: Maybe<User>;
  findPageIdentity: IdentityPage;
  findPageQcmAnswer: QcmAnswerPage;
  findPageQcmModule: QcmModulePage;
  findPageQcmProgress: QcmProgressPage;
  findPageQcmQuestion: QcmQuestionPage;
  findPageQcmSession: QcmSessionPage;
  findPageTdtChallenge: TdtChallengePage;
  findPageTdtProgress: TdtProgressPage;
  findPageTdtSession: TdtSessionPage;
  findPageTdtSubmission: TdtSubmissionPage;
  findPageUser: UserPage;
  me: Identity;
  myUser?: Maybe<User>;
};


export type QueryFindAllIdentityArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllQcmAnswerArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllQcmModuleArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllQcmProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllQcmQuestionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllQcmSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllTdtChallengeArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllTdtProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllTdtSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllTdtSubmissionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllUserArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindCursorIdentityArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorQcmAnswerArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorQcmModuleArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorQcmProgressArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorQcmQuestionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorQcmSessionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorTdtChallengeArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorTdtProgressArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorTdtSessionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorTdtSubmissionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindCursorUserArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindOneIdentityArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneQcmAnswerArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneQcmModuleArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneQcmProgressArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneQcmQuestionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneQcmSessionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneTdtChallengeArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneTdtProgressArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneTdtSessionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneTdtSubmissionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindOneUserArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindPageIdentityArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageQcmAnswerArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageQcmModuleArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageQcmProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageQcmQuestionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageQcmSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageTdtChallengeArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageTdtProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageTdtSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageTdtSubmissionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryFindPageUserArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type TdtChallenge = {
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  data: TdtChallengeData;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  difficulty: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  sortOrder: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TdtChallengeCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<TdtChallenge>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type TdtChallengeData = {
  description: Scalars['String']['output'];
  docs?: Maybe<Scalars['String']['output']>;
  starterCode: Scalars['String']['output'];
  testCode: Scalars['String']['output'];
};

export type TdtChallengeDataInput = {
  description: Scalars['String']['input'];
  docs?: InputMaybe<Scalars['String']['input']>;
  starterCode: Scalars['String']['input'];
  testCode: Scalars['String']['input'];
};

export type TdtChallengePage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<TdtChallenge>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TdtProgress = {
  bestSubmissionId?: Maybe<Scalars['ID']['output']>;
  challengeId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstSolvedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isSolved: Scalars['Boolean']['output'];
  lastAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  totalAttempts: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type TdtProgressCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<TdtProgress>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type TdtProgressPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<TdtProgress>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TdtSession = {
  attemptsCount: Scalars['Float']['output'];
  challengeId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  solvedAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: TdtSessionStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type TdtSessionCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<TdtSession>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type TdtSessionPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<TdtSession>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum TdtSessionStatus {
  Abandoned = 'Abandoned',
  InProgress = 'InProgress',
  Solved = 'Solved'
}

export type TdtSubmission = {
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  failedTests: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  logs?: Maybe<Scalars['String']['output']>;
  passedTests: Scalars['Int']['output'];
  sessionId: Scalars['ID']['output'];
  submittedAt: Scalars['DateTime']['output'];
  totalTests: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type TdtSubmissionCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<TdtSubmission>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type TdtSubmissionPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<TdtSubmission>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type UpdateIdentityInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  identityName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQcmAnswerInput = {
  id: Scalars['ID']['input'];
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId?: InputMaybe<Scalars['String']['input']>;
  selectedOption?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['ID']['input']>;
  timeSpentMs?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateQcmModuleInput = {
  id: Scalars['ID']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateQcmProgressInput = {
  attemptsCount?: InputMaybe<Scalars['Float']['input']>;
  bestScore?: InputMaybe<Scalars['Float']['input']>;
  firstCompletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  lastAttemptAt?: InputMaybe<Scalars['DateTime']['input']>;
  lastSessionId?: InputMaybe<Scalars['ID']['input']>;
  moduleId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQcmQuestionInput = {
  data?: InputMaybe<QcmQuestionDataInput>;
  difficulty?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  moduleId?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQcmSessionInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  moduleId?: InputMaybe<Scalars['String']['input']>;
  score?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<QcmSessionStatus>;
  totalQuestions?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateTdtChallengeInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<TdtChallengeDataInput>;
  difficulty?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTdtProgressInput = {
  bestSubmissionId?: InputMaybe<Scalars['ID']['input']>;
  challengeId?: InputMaybe<Scalars['String']['input']>;
  firstSolvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  isSolved?: InputMaybe<Scalars['Boolean']['input']>;
  lastAttemptAt?: InputMaybe<Scalars['DateTime']['input']>;
  totalAttempts?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTdtSessionInput = {
  challengeId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  solvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<TdtSessionStatus>;
};

export type UpdateTdtSubmissionInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  failedTests?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  logs?: InputMaybe<Scalars['String']['input']>;
  passedTests?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['ID']['input']>;
  totalTests?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  identity?: InputMaybe<UpdateIdentityInput>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identity?: Maybe<Identity>;
  identityId: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserCursorPage = {
  hasNext: Scalars['Boolean']['output'];
  items: Array<User>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type UserPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<User>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { accessToken: string, refreshToken: string, identity: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null } } };

export type RegisterMutationVariables = Exact<{
  input: CreateUserInput;
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { register: { accessToken: string, refreshToken: string, identity: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null } } };

export type LogoutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null, identityName?: string | null, user?: { firstName?: string | null, lastName?: string | null } | null } };
