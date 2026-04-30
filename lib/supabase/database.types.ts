export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type VehicleType = 'tata_yodha' | 'bolero_pickup' | 'mini_truck' | 'mahindra_pickup' | 'tata_ace'
export type VehicleStatus = 'available' | 'busy' | 'offline'
export type BookingStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
export type UserRole = 'customer' | 'driver' | 'admin'
export type DocumentType = 'license' | 'vehicle_registration' | 'insurance' | 'identity' | 'permit'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          role: UserRole
          avatar_url: string | null
          city: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      vehicles: {
        Row: {
          id: string
          owner_id: string
          type: VehicleType
          display_name: string
          capacity_kg: number
          price_per_km: number
          base_fare: number
          status: VehicleStatus
          registration_number: string
          current_lat: number
          current_lng: number
          city: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          vehicle_id: string | null
          driver_id: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          drop_address: string
          drop_lat: number
          drop_lng: number
          distance_km: number
          estimated_price: number
          final_price: number | null
          vehicle_type: string
          goods_description: string | null
          weight_kg: number | null
          status: BookingStatus
          requested_at: string
          accepted_at: string | null
          started_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          driver_notes: string | null
          rating: number | null
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      documents: {
        Row: {
          id: string
          driver_id: string
          type: DocumentType
          file_url: string
          file_name: string
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          uploaded_at: string
          reviewed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      driver_earnings: {
        Row: {
          id: string
          driver_id: string
          booking_id: string
          amount: number
          platform_fee: number
          net_amount: number
          paid_at: string
        }
        Insert: Omit<Database['public']['Tables']['driver_earnings']['Row'], 'id' | 'paid_at'>
        Update: Partial<Database['public']['Tables']['driver_earnings']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
