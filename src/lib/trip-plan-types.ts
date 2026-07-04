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
  personalItems: PersonalItemDTO[];
}

export interface GroupItemDTO {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export interface TripPlanDTO {
  id: string;
  mountainId: string;
  mountainName: string;
  startDate: string;
  endDate: string;
  members: MemberDTO[];
  groupItems: GroupItemDTO[];
}

export interface TripPlanSummaryDTO {
  id: string;
  mountainId: string;
  mountainName: string;
  startDate: string;
  endDate: string;
  memberNames: string[];
  totalGroupPrice: number;
  packedCount: number;
  totalItemCount: number;
}
