import { User } from '../models/User';

interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  email: string;
}

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  user.firstName = input.firstName;
  user.lastName = input.lastName;
  user.email = input.email;

  await user.save();

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};