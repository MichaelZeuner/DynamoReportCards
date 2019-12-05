export interface StrengthFlexibilityGroup {
  strength_flexibility_group_id: number;
  levels_id: number;
  type: string;
  restriction: number;
  restriction_unit: string;
}

export interface StrengthFlexibility {
  strength_flexibility_id: number;
  strength_flexibility_group_id: number;
  name: string;
}
