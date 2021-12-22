import {
  ApolloError,
  // toApolloError,
  // SyntaxError,
  // ValidationError,
  AuthenticationError,
  ForbiddenError as AplloForbiddenError,
  UserInputError,
} from "apollo-server-express";

export class InvaildInputError extends UserInputError {
  constructor(message: string = "Invalid input error") {
    super(message);

    Object.defineProperty(this, "name", { value: "InvaildInputError" });
  }
}

export class AuthError extends AuthenticationError {
  constructor(message: string = "Unauthenticated") {
    super(message);

    Object.defineProperty(this, "name", { value: "AuthError" });
  }
}

export class ForbiddenError extends AplloForbiddenError {
  constructor(message: string = "ForbiddenError") {
    super(message);

    Object.defineProperty(this, "name", { value: "ForbiddenError" });
  }
}

export class InternelError extends ApolloError {
  constructor(message: string = "Internel error") {
    super(message);

    Object.defineProperty(this, "name", { value: "InternelError" });
  }
}
