import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);

    return omit(user, "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await UserModel.comparePassword(password, user.password);

  if (!isValid) return false;

  return omit(user, "password");
}

export async function findUser(query: Partial<UserDocument>) {
  return UserModel.findOne(query);
}
