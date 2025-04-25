/* eslint-disable perfectionist/sort-interfaces */
interface ITrakteerData {
  created_at: string
  transaction_id: string
  type: string
  supporter_name: string
  supporter_avatar: string
  supporter_message: string
  media: {
    gif: string
    video: {
      id: string
      start: number
    }
  }
  unit: string
  unit_icon: string
  quantity: number
  price: number
  net_amount: number
}

export type { ITrakteerData };