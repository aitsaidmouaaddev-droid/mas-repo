import { gql } from '@apollo/client';

export const FIND_ALL_QCM_MODULES = gql`
  query FindAllQcmModules {
    findAllQcmModule {
      id
      label
      description
      sortOrder
    }
  }
`;

export const FIND_ALL_QCM_QUESTIONS = gql`
  query FindAllQcmQuestions {
    findAllQcmQuestion {
      id
      moduleId
      type
      difficulty
      sortOrder
      data {
        question
        choices
        answer
        tags
        explanation
        docs
      }
    }
  }
`;

export const FIND_ALL_TDT_CHALLENGES = gql`
  query FindAllTdtChallenges {
    findAllTdtChallenge {
      id
      title
      category
      difficulty
      sortOrder
      data {
        description
        starterCode
        testCode
        docs
      }
    }
  }
`;

export const FIND_ONE_TDT_CHALLENGE = gql`
  query FindOneTdtChallenge($id: ID!) {
    findOneTdtChallenge(id: $id) {
      id
      title
      category
      difficulty
      data {
        description
        starterCode
        testCode
        docs
      }
    }
  }
`;

export const MY_USER = gql`
  query MyUser($id: ID!) {
    findOneUser(id: $id, populate: ["identity"]) {
      id
      firstName
      lastName
      dateOfBirth
      identity {
        id
        email
        displayName
        avatarUrl
        identityName
      }
    }
  }
`;

export const FIND_ONE_QCM_MODULE = gql`
  query FindOneQcmModule($id: ID!) {
    findOneQcmModule(id: $id) {
      id
      label
      sortOrder
    }
  }
`;

export const FIND_ONE_QCM_QUESTION = gql`
  query FindOneQcmQuestion($id: ID!) {
    findOneQcmQuestion(id: $id) {
      id
      moduleId
      type
      difficulty
      sortOrder
      data {
        question
        choices
        answer
        tags
        explanation
        docs
      }
    }
  }
`;

export const FIND_ONE_QCM_SESSION = gql`
  query FindOneQcmSession($id: ID!) {
    findOneQcmSession(id: $id) {
      id
      moduleId
      userId
      status
      totalQuestions
      startedAt
    }
  }
`;

export const CREATE_QCM_SESSION = gql`
  mutation CreateQcmSession($input: CreateQcmSessionInput!) {
    createQcmSession(input: $input) {
      id
      moduleId
      status
      totalQuestions
    }
  }
`;

export const FIND_ONE_TDT_SESSION = gql`
  query FindOneTdtSession($id: ID!) {
    findOneTdtSession(id: $id) {
      id
      challengeId
      status
      attemptsCount
    }
  }
`;

export const CREATE_TDT_SESSION = gql`
  mutation CreateTdtSession($input: CreateTdtSessionInput!) {
    createTdtSession(input: $input) {
      id
      challengeId
      status
    }
  }
`;

export const FIND_ACTIVE_QCM_SESSIONS = gql`
  query FindActiveQcmSessions($filter: String!) {
    findByQcmSession(filter: $filter) {
      id
      moduleId
      totalQuestions
    }
  }
`;

export const UPDATE_QCM_SESSION = gql`
  mutation UpdateQcmSession($input: UpdateQcmSessionInput!) {
    updateQcmSession(input: $input) {
      id
      status
      score
      completedAt
    }
  }
`;

export const CREATE_QCM_ANSWER = gql`
  mutation CreateQcmAnswer($input: CreateQcmAnswerInput!) {
    createQcmAnswer(input: $input) {
      id
      isCorrect
    }
  }
`;

export const UPDATE_QCM_ANSWER = gql`
  mutation UpdateQcmAnswer($input: UpdateQcmAnswerInput!) {
    updateQcmAnswer(input: $input) {
      id
      selectedOption
      isCorrect
    }
  }
`;

export const FIND_SESSION_ANSWERS = gql`
  query FindSessionAnswers($filter: String!) {
    findByQcmAnswer(filter: $filter) {
      id
      questionId
      selectedOption
      isCorrect
    }
  }
`;

export const FIND_MODULE_PROGRESS = gql`
  query FindModuleProgress($filter: String!) {
    findByQcmProgress(filter: $filter) {
      id
      moduleId
      attemptsCount
      bestScore
      isCompleted
      firstCompletedAt
      lastAttemptAt
      lastSessionId
    }
  }
`;

export const CREATE_QCM_PROGRESS = gql`
  mutation CreateQcmProgress($input: CreateQcmProgressInput!) {
    createQcmProgress(input: $input) {
      id
      moduleId
      attemptsCount
      bestScore
    }
  }
`;

export const UPDATE_QCM_PROGRESS = gql`
  mutation UpdateQcmProgress($input: UpdateQcmProgressInput!) {
    updateQcmProgress(input: $input) {
      id
      attemptsCount
      bestScore
      isCompleted
      lastAttemptAt
      lastSessionId
    }
  }
`;

export const FIND_ALL_TDT_PROGRESS = gql`
  query FindAllTdtProgress {
    findAllTdtProgress {
      id
      challengeId
      isSolved
      totalAttempts
      firstSolvedAt
      lastAttemptAt
    }
  }
`;
