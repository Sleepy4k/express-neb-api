/* eslint-disable perfectionist/sort-interfaces */
interface ISaweriaData {
  version: string;
  created_at: string;
  id: string;
  type: string;
  amount_raw: number;
  cut: number;
  donator_name: string;
  donator_email: string;
  donator_is_user: boolean;
  message: string;
  etc: {
    amount_to_display: number;
  };
}

export type { ISaweriaData };
