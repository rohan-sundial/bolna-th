export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isError: boolean;
}
