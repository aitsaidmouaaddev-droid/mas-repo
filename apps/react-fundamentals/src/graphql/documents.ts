import { gql } from '@apollo/client';

export const FIND_ALL_QCM_MODULES = gql`
  query FindAllQcmModules {
    findAllQcmModule {
      id
      label
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
