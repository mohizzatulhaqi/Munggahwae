export interface PersonalItemDTO {
  id: string;
  name: string;
  checked: boolean;
  imageUrl: string | null;
}

export interface MemberDTO {
  id: string;
  name: string;
  order: number;
  hasPaid: boolean;
  personalItems: PersonalItemDTO[];
}

export interface GroupItemDTO {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export interface JournalEntryDTO {
  id: string;
  entryDate: string;
  note: string;
  imageUrl: string | null;
  authorName: string | null;
  createdAt: string;
}

export interface ItineraryCheckpoint {
  name: string;
  note: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  checkpoints: ItineraryCheckpoint[];
}

export interface TripChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ReadinessFinding {
  severity: 'tinggi' | 'sedang' | 'rendah';
  title: string;
  detail: string;
}

export interface ReadinessResult {
  score: number;
  summary: string;
  findings: ReadinessFinding[];
  strengths: string[];
}

export interface TripPlanDTO {
  id: string;
  mountainId: string;
  mountainName: string;
  ascentTrail: string | null;
  descentTrail: string | null;
  startDate: string;
  endDate: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  itineraryDays: ItineraryDay[] | null;
  members: MemberDTO[];
  groupItems: GroupItemDTO[];
  journalEntries: JournalEntryDTO[];
}

export interface TripPlanSummaryDTO {
  id: string;
  mountainId: string;
  mountainName: string;
  ascentTrail: string | null;
  descentTrail: string | null;
  startDate: string;
  endDate: string;
  memberNames: string[];
  totalGroupPrice: number;
  packedCount: number;
  totalItemCount: number;
  paidCount: number;
  memberCount: number;
}
