// dto/user-listings.dto.ts
export type ListingType = 'car' | 'part' | 'service'

export class ListingDto {
  id: number
  type: ListingType
  title: string
  price: number | null
  previewUrl: string | null
  city: string | null
  status: 'published' | 'draft' | 'deleted'
  createdAt: string
  extra?: Record<string, any>
}

export class ListingsResponse {
  data: ListingDto[]
  nextCursor?: string | null // формат ISO_date_id
}

export class UserSummaryDto {
  user: { id: number; phone: string }
  counts: { cars: number; parts: number; services: number }
}
