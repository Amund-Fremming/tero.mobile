export enum UserType {
  Guest,
  Registered,
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Unknown = "Unknown",
}

export interface ClientPopup {
  heading: string;
  paragraph: string;
  active: boolean;
}

export interface ActivityStats {
  total_game_count: number;
  total_user_count: number;
  recent: RecentUserStats;
  average: AverageUserStats;
}

export interface RecentUserStats {
  this_month_users: number;
  this_week_users: number;
  todays_users: number;
}

export interface AverageUserStats {
  avg_month_users: number;
  avg_week_users: number;
  avg_daily_users: number;
}

export interface SystemHealth {
  platform: boolean;
  database: boolean;
  session: boolean;
}

export interface LogCategoryCount {
  info: number;
  warning: number;
  critical: number;
}

export enum LogCeverity {
  Info = "Info",
  Warning = "Warning",
  Critical = "Critical",
}

export enum SubjectType {
  RegisteredUser,
  GuestUser,
  Integration,
  System,
}

export enum LogAction {
  Create,
  Read,
  Update,
  Delete,
  Sync,
  Other,
}

export interface SystemLog {
  id: number;
  subject_id: String;
  subject_type: SubjectType;
  action: LogAction;
  ceverity: LogCeverity;
  file_name: String;
  description: String;
  metadata?: string;
  created_at: string;
}

export interface BaseUser {
  id: string;
  username: string;
  auth0_id?: string;
  userType: UserType;
  last_active?: string;
  gender: Gender;
  email?: string;
  email_verified?: boolean;
  updated_at: string;
  family_name?: string;
  given_name?: string;
  created_at?: string;
  birth_date?: string;
}

export interface PatchUserRequest {
  username?: string;
  gender?: Gender;
  family_name?: string;
  given_name?: string;
  birth_date?: string;
}

export enum UserRole {
  BaseUser = "BaseUser",
  Admin = "Admin",
}

export interface UserWithRole {
  role: UserRole;
  user: BaseUser;
}

export enum GameType {
  Quiz = "Quiz",
  Roulette = "Roulette",
  Duel = "Duel",
  Imposter = "Imposter",
  Dice = "Dice",
}

export interface CreateGameTipRequest {
  header: string;
  mobile_phone: string;
  description: string;
}

export interface CreateGameRequest {
  name: string;
  category: GameCategory;
}

export enum GameCategory {
  Girls = "Girls",
  Boys = "Boys",
  Mixed = "Mixed",
  InnerCircle = "InnerCircle",
}

export interface ResetPasswordRequest {
  email: string;
}

export interface GameTip {
  id: string;
  header: string;
  mobile_phone: string;
  description: string;
  created_at: string;
}

export interface InteractiveGameResponse {
  key: string;
  hub_address: string;
  is_draft: boolean;
}

export interface JoinGameResponse {
  game_key: string;
  hub_address: string;
  game_type: GameType;
  is_draft: boolean;
}

export enum GameEntryMode {
  Creator,
  Host,
  Participant,
  Member,
}

export interface PagedResponse<T> {
  page_num: number;
  items: T[];
  has_next: boolean;
  has_prev: boolean;
}

export interface GamePagedRequest {
  page_num: number | null;
  game_type: GameType | null;
  category: GameCategory | null;
}

export interface GameBase {
  id: string;
  name: String;
  game_type: GameType;
  category: GameCategory;
  iterations: number;
  times_played: number;
  last_played: string;
  synced: boolean;
}
