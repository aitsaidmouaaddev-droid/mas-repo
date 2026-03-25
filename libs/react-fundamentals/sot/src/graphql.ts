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
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
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
  data: TdtSubmissionDataInput;
  sessionId: Scalars['ID']['input'];
  status: TdtSubmissionStatus;
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
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type QcmModuleDescriptionArgs = {
  lang?: Scalars['String']['input'];
};


export type QcmModuleLabelArgs = {
  lang?: Scalars['String']['input'];
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


export type QcmQuestionDataArgs = {
  lang?: Scalars['String']['input'];
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
  duration: Scalars['Int']['output'];
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
  countByIdentity: Scalars['Int']['output'];
  countByQcmAnswer: Scalars['Int']['output'];
  countByQcmModule: Scalars['Int']['output'];
  countByQcmProgress: Scalars['Int']['output'];
  countByQcmQuestion: Scalars['Int']['output'];
  countByQcmSession: Scalars['Int']['output'];
  countByTdtChallenge: Scalars['Int']['output'];
  countByTdtProgress: Scalars['Int']['output'];
  countByTdtSession: Scalars['Int']['output'];
  countByTdtSubmission: Scalars['Int']['output'];
  countByUser: Scalars['Int']['output'];
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
  findByIdentity: Array<Identity>;
  findByQcmAnswer: Array<QcmAnswer>;
  findByQcmModule: Array<QcmModule>;
  findByQcmProgress: Array<QcmProgress>;
  findByQcmQuestion: Array<QcmQuestion>;
  findByQcmSession: Array<QcmSession>;
  findByTdtChallenge: Array<TdtChallenge>;
  findByTdtProgress: Array<TdtProgress>;
  findByTdtSession: Array<TdtSession>;
  findByTdtSubmission: Array<TdtSubmission>;
  findByUser: Array<User>;
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
};


export type QueryCountByIdentityArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByQcmAnswerArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByQcmModuleArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByQcmProgressArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByQcmQuestionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByQcmSessionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByTdtChallengeArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByTdtProgressArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByTdtSessionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByTdtSubmissionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCountByUserArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFindAllIdentityArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllQcmAnswerArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllQcmModuleArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllQcmProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllQcmQuestionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllQcmSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllTdtChallengeArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllTdtProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllTdtSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllTdtSubmissionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindAllUserArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByIdentityArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByQcmAnswerArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByQcmModuleArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByQcmProgressArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByQcmQuestionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByQcmSessionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByTdtChallengeArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByTdtProgressArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByTdtSessionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByTdtSubmissionArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindByUserArgs = {
  filter: Scalars['String']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorIdentityArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorQcmAnswerArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorQcmModuleArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorQcmProgressArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorQcmQuestionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorQcmSessionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorTdtChallengeArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorTdtProgressArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorTdtSessionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorTdtSubmissionArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindCursorUserArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneIdentityArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneQcmAnswerArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneQcmModuleArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneQcmProgressArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneQcmQuestionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneQcmSessionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneTdtChallengeArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneTdtProgressArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneTdtSessionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneTdtSubmissionArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindOneUserArgs = {
  id: Scalars['ID']['input'];
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageIdentityArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageQcmAnswerArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageQcmModuleArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageQcmProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageQcmQuestionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageQcmSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageTdtChallengeArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageTdtProgressArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageTdtSessionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageTdtSubmissionArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFindPageUserArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  populate?: InputMaybe<Array<Scalars['String']['input']>>;
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
  createdAt: Scalars['DateTime']['output'];
  data: TdtSubmissionData;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  sessionId: Scalars['ID']['output'];
  status: TdtSubmissionStatus;
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

export type TdtSubmissionData = {
  code: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
};

export type TdtSubmissionDataInput = {
  code: Scalars['String']['input'];
  duration: Scalars['Float']['input'];
};

export type TdtSubmissionPage = {
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  items: Array<TdtSubmission>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum TdtSubmissionStatus {
  Failed = 'Failed',
  Passed = 'Passed'
}

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
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
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
  data?: InputMaybe<TdtSubmissionDataInput>;
  id: Scalars['ID']['input'];
  sessionId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<TdtSubmissionStatus>;
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

export type MeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MeQuery = { findOneUser?: { id: string, firstName?: string | null, lastName?: string | null, dateOfBirth?: any | null, identity?: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null, identityName?: string | null } | null } | null };

export type FindAllQcmModulesQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']['input']>;
}>;


export type FindAllQcmModulesQuery = { findAllQcmModule: Array<{ id: string, label: string, description?: string | null, sortOrder: number, category: string }> };

export type FindAllQcmQuestionsQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']['input']>;
}>;


export type FindAllQcmQuestionsQuery = { findAllQcmQuestion: Array<{ id: string, moduleId: string, type: string, difficulty: string, sortOrder: number, data: { question: string, choices: Array<string>, answer: string, tags: Array<string>, explanation?: string | null, docs?: string | null } }> };

export type FindAllTdtChallengesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllTdtChallengesQuery = { findAllTdtChallenge: Array<{ id: string, title: string, category: string, difficulty: string, sortOrder: number, data: { description: string, starterCode: string, testCode: string, docs?: string | null } }> };

export type FindOneTdtChallengeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindOneTdtChallengeQuery = { findOneTdtChallenge?: { id: string, title: string, category: string, difficulty: string, data: { description: string, starterCode: string, testCode: string, docs?: string | null } } | null };

export type MyUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MyUserQuery = { findOneUser?: { id: string, firstName?: string | null, lastName?: string | null, dateOfBirth?: any | null, identity?: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null, identityName?: string | null } | null } | null };

export type FindOneQcmModuleQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  lang?: InputMaybe<Scalars['String']['input']>;
}>;


export type FindOneQcmModuleQuery = { findOneQcmModule?: { id: string, label: string, sortOrder: number, category: string } | null };

export type FindOneQcmQuestionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  lang?: InputMaybe<Scalars['String']['input']>;
}>;


export type FindOneQcmQuestionQuery = { findOneQcmQuestion?: { id: string, moduleId: string, type: string, difficulty: string, sortOrder: number, data: { question: string, choices: Array<string>, answer: string, tags: Array<string>, explanation?: string | null, docs?: string | null } } | null };

export type FindOneQcmSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindOneQcmSessionQuery = { findOneQcmSession?: { id: string, moduleId: string, userId: string, status: QcmSessionStatus, totalQuestions: number, startedAt: any } | null };

export type CreateQcmSessionMutationVariables = Exact<{
  input: CreateQcmSessionInput;
}>;


export type CreateQcmSessionMutation = { createQcmSession: { id: string, moduleId: string, status: QcmSessionStatus, totalQuestions: number } };

export type FindOneTdtSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindOneTdtSessionQuery = { findOneTdtSession?: { id: string, challengeId: string, status: TdtSessionStatus, attemptsCount: number } | null };

export type CreateTdtSessionMutationVariables = Exact<{
  input: CreateTdtSessionInput;
}>;


export type CreateTdtSessionMutation = { createTdtSession: { id: string, challengeId: string, status: TdtSessionStatus } };

export type UpdateTdtSessionMutationVariables = Exact<{
  input: UpdateTdtSessionInput;
}>;


export type UpdateTdtSessionMutation = { updateTdtSession: { id: string, status: TdtSessionStatus, solvedAt?: any | null } };

export type CreateTdtSubmissionMutationVariables = Exact<{
  input: CreateTdtSubmissionInput;
}>;


export type CreateTdtSubmissionMutation = { createTdtSubmission: { id: string, status: TdtSubmissionStatus, totalTests: number, submittedAt: any } };

export type FindActiveQcmSessionsQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindActiveQcmSessionsQuery = { findByQcmSession: Array<{ id: string, moduleId: string, totalQuestions: number }> };

export type FindAllQcmSessionsQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindAllQcmSessionsQuery = { findByQcmSession: Array<{ id: string, moduleId: string, status: QcmSessionStatus, score?: number | null, totalQuestions: number, startedAt: any, completedAt?: any | null }> };

export type UpdateQcmSessionMutationVariables = Exact<{
  input: UpdateQcmSessionInput;
}>;


export type UpdateQcmSessionMutation = { updateQcmSession: { id: string, status: QcmSessionStatus, score?: number | null, completedAt?: any | null } };

export type CreateQcmAnswerMutationVariables = Exact<{
  input: CreateQcmAnswerInput;
}>;


export type CreateQcmAnswerMutation = { createQcmAnswer: { id: string, isCorrect: boolean } };

export type UpdateQcmAnswerMutationVariables = Exact<{
  input: UpdateQcmAnswerInput;
}>;


export type UpdateQcmAnswerMutation = { updateQcmAnswer: { id: string, selectedOption: string, isCorrect: boolean } };

export type FindSessionAnswersQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindSessionAnswersQuery = { findByQcmAnswer: Array<{ id: string, questionId: string, selectedOption: string, isCorrect: boolean }> };

export type FindModuleProgressQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindModuleProgressQuery = { findByQcmProgress: Array<{ id: string, moduleId: string, attemptsCount: number, bestScore?: number | null, isCompleted: boolean, firstCompletedAt?: any | null, lastAttemptAt?: any | null, lastSessionId?: string | null }> };

export type CreateQcmProgressMutationVariables = Exact<{
  input: CreateQcmProgressInput;
}>;


export type CreateQcmProgressMutation = { createQcmProgress: { id: string, moduleId: string, attemptsCount: number, bestScore?: number | null } };

export type UpdateQcmProgressMutationVariables = Exact<{
  input: UpdateQcmProgressInput;
}>;


export type UpdateQcmProgressMutation = { updateQcmProgress: { id: string, attemptsCount: number, bestScore?: number | null, isCompleted: boolean, lastAttemptAt?: any | null, lastSessionId?: string | null } };

export type FindAllTdtProgressQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllTdtProgressQuery = { findAllTdtProgress: Array<{ id: string, challengeId: string, isSolved: boolean, totalAttempts: number, firstSolvedAt?: any | null, lastAttemptAt?: any | null }> };

export type FindTdtProgressByChallengeQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindTdtProgressByChallengeQuery = { findByTdtProgress: Array<{ id: string, challengeId: string, isSolved: boolean, totalAttempts: number, firstSolvedAt?: any | null, lastAttemptAt?: any | null }> };

export type CreateTdtProgressMutationVariables = Exact<{
  input: CreateTdtProgressInput;
}>;


export type CreateTdtProgressMutation = { createTdtProgress: { id: string, challengeId: string, isSolved: boolean, totalAttempts: number } };

export type UpdateTdtProgressMutationVariables = Exact<{
  input: UpdateTdtProgressInput;
}>;


export type UpdateTdtProgressMutation = { updateTdtProgress: { id: string, isSolved: boolean, totalAttempts: number } };

export type FindTdtSessionsQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindTdtSessionsQuery = { findByTdtSession: Array<{ id: string, challengeId: string, status: TdtSessionStatus, attemptsCount: number, startedAt: any, solvedAt?: any | null }> };

export type FindAllTdtSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllTdtSessionsQuery = { findAllTdtSession: Array<{ id: string, challengeId: string, status: TdtSessionStatus, solvedAt?: any | null }> };

export type DeleteTdtSubmissionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTdtSubmissionMutation = { deleteTdtSubmission: boolean };

export type FindTdtSubmissionsBySessionQueryVariables = Exact<{
  filter: Scalars['String']['input'];
}>;


export type FindTdtSubmissionsBySessionQuery = { findByTdtSubmission: Array<{ id: string }> };
