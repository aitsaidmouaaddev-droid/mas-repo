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

export type AnswerQuestionInput = {
  isCorrect: Scalars['Boolean']['input'];
  questionId: Scalars['String']['input'];
  selectedOption: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
  timeSpentMs?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateIdentityInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  identityName?: InputMaybe<Scalars['String']['input']>;
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
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identityName?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
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
  abandonQcmSession: QcmSession;
  abandonTdtSession: TdtSession;
  answerQcmQuestion: QcmAnswer;
  completeQcmSession: QcmSession;
  createIdentity: Identity;
  createUser: User;
  deleteIdentity: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  logoutAll: Scalars['Boolean']['output'];
  refreshToken: LoginResponse;
  register: LoginResponse;
  resetPassword: Scalars['Boolean']['output'];
  startQcmSession: QcmSession;
  startTdtSession: TdtSession;
  submitTdtCode: TdtSubmission;
  updateIdentity: Identity;
  updateUser: User;
};


export type MutationAbandonQcmSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationAbandonTdtSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationAnswerQcmQuestionArgs = {
  input: AnswerQuestionInput;
};


export type MutationCompleteQcmSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationCreateIdentityArgs = {
  input: CreateIdentityInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteIdentityArgs = {
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


export type MutationStartQcmSessionArgs = {
  input: StartQcmSessionInput;
};


export type MutationStartTdtSessionArgs = {
  input: StartTdtSessionInput;
};


export type MutationSubmitTdtCodeArgs = {
  input: SubmitCodeInput;
};


export type MutationUpdateIdentityArgs = {
  input: UpdateIdentityInput;
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
  timeSpentMs?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type QcmProgress = {
  attemptsCount: Scalars['Int']['output'];
  bestScore?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstCompletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  identityId: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  lastSessionId?: Maybe<Scalars['ID']['output']>;
  moduleId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type QcmSession = {
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  identityId: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  moduleId: Scalars['String']['output'];
  score?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: QcmSessionStatus;
  totalQuestions: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum QcmSessionStatus {
  Abandoned = 'abandoned',
  Completed = 'completed',
  InProgress = 'in_progress'
}

export type Query = {
  findAllIdentity: Array<Identity>;
  findAllUser: Array<User>;
  findCursorIdentity: IdentityCursorPage;
  findCursorUser: UserCursorPage;
  findOneIdentity?: Maybe<Identity>;
  findOneUser?: Maybe<User>;
  findPageIdentity: IdentityPage;
  findPageUser: UserPage;
  me: Identity;
  myQcmModuleProgress?: Maybe<QcmProgress>;
  myQcmProgress: Array<QcmProgress>;
  myQcmSessions: Array<QcmSession>;
  myTdtChallengeProgress?: Maybe<TdtProgress>;
  myTdtProgress: Array<TdtProgress>;
  myTdtSessions: Array<TdtSession>;
  myUser?: Maybe<User>;
  qcmSessionAnswers: Array<QcmAnswer>;
  tdtSessionSubmissions: Array<TdtSubmission>;
};


export type QueryFindAllIdentityArgs = {
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


export type QueryFindCursorUserArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
};


export type QueryFindOneIdentityArgs = {
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


export type QueryFindPageUserArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type QueryMyQcmModuleProgressArgs = {
  moduleId: Scalars['String']['input'];
};


export type QueryMyQcmSessionsArgs = {
  moduleId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyTdtChallengeProgressArgs = {
  challengeId: Scalars['String']['input'];
};


export type QueryMyTdtSessionsArgs = {
  challengeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQcmSessionAnswersArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryTdtSessionSubmissionsArgs = {
  sessionId: Scalars['ID']['input'];
};

export type StartQcmSessionInput = {
  moduleId: Scalars['String']['input'];
  totalQuestions: Scalars['Int']['input'];
};

export type StartTdtSessionInput = {
  challengeId: Scalars['String']['input'];
};

export type SubmitCodeInput = {
  code: Scalars['String']['input'];
  failedTests: Scalars['Int']['input'];
  logs?: InputMaybe<Scalars['String']['input']>;
  passedTests: Scalars['Int']['input'];
  sessionId: Scalars['ID']['input'];
  totalTests: Scalars['Int']['input'];
};

export type TdtProgress = {
  bestSubmissionId?: Maybe<Scalars['ID']['output']>;
  challengeId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstSolvedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  identityId: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isSolved: Scalars['Boolean']['output'];
  lastAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  totalAttempts: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TdtSession = {
  attemptsCount: Scalars['Int']['output'];
  challengeId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  identityId: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  solvedAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: TdtSessionStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum TdtSessionStatus {
  Abandoned = 'abandoned',
  InProgress = 'in_progress',
  Solved = 'solved'
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
};

export type UpdateIdentityInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  identityName?: InputMaybe<Scalars['String']['input']>;
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


export type MeQuery = { me: { id: string, email?: string | null, displayName?: string | null, avatarUrl?: string | null, identityName?: string | null, firstName?: string | null, lastName?: string | null } };
