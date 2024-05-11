export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bills: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          rental_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          rental_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          rental_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      client_type: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          type_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          type_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          type_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      "client-status": {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string
          city: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          id: number
          isForeign: boolean
          last_name: string
          license: string | null
          name: string
          phone: string | null
          rfc: string | null
          status: number | null
          type: number
          updated_at: string
          voter_code: string | null
        }
        Insert: {
          address?: string
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isForeign?: boolean
          last_name?: string
          license?: string | null
          name?: string
          phone?: string | null
          rfc?: string | null
          status?: number | null
          type?: number
          updated_at?: string
          voter_code?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isForeign?: boolean
          last_name?: string
          license?: string | null
          name?: string
          phone?: string | null
          rfc?: string | null
          status?: number | null
          type?: number
          updated_at?: string
          voter_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "client-status"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_types: {
        Row: {
          client_id: number
          type_id: number
        }
        Insert: {
          client_id: number
          type_id: number
        }
        Update: {
          client_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_types_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "client_type"
            referencedColumns: ["id"]
          },
        ]
      }
      "clients-calls": {
        Row: {
          client_id: number
          created_at: string
          deleted_at: string | null
          description: string
          id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          client_id: number
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: number
          updated_at?: string
          user_id: number
        }
        Update: {
          client_id?: number
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "client-calls_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          created_at: string
          deleted_ad: string | null
          id: number
          rental_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_ad?: string | null
          id?: number
          rental_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_ad?: string | null
          id?: number
          rental_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          cost: number | null
          created_at: string
          deleted_at: string | null
          id: number
          reference: string | null
          status: number
          type: number
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          reference?: string | null
          status?: number
          type?: number
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          reference?: string | null
          status?: number
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "equipment_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "equipment_type"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_status: {
        Row: {
          id: number
          status_name: string
        }
        Insert: {
          id?: number
          status_name: string
        }
        Update: {
          id?: number
          status_name?: string
        }
        Relationships: []
      }
      equipment_type: {
        Row: {
          id: number
          type_name: string
        }
        Insert: {
          id?: number
          type_name: string
        }
        Update: {
          id?: number
          type_name?: string
        }
        Relationships: []
      }
      equipments_status: {
        Row: {
          equipment_id: number
          status_id: number
        }
        Insert: {
          equipment_id: number
          status_id: number
        }
        Update: {
          equipment_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipments_status_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipments_status_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "equipment_status"
            referencedColumns: ["id"]
          },
        ]
      }
      equipments_types: {
        Row: {
          equipment_id: number
          type_id: number
        }
        Insert: {
          equipment_id: number
          type_id: number
        }
        Update: {
          equipment_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipments_types_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipments_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "equipment_type"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string | null
          created_at: string
          id: number
          note: string | null
          user_id: number
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: number
          note?: string | null
          user_id: number
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: number
          note?: string | null
          user_id?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bill_id: number
          created_at: string
          id: number
        }
        Insert: {
          amount?: number
          bill_id: number
          created_at?: string
          id?: number
        }
        Update: {
          amount?: number
          bill_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_equipments: {
        Row: {
          equipment_id: number
          rental_id: number
        }
        Insert: {
          equipment_id: number
          rental_id: number
        }
        Update: {
          equipment_id?: number
          rental_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "rentals_equipments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_equipments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          building_address: string | null
          client_id: number
          client_reference_id: number | null
          created_at: string
          deleted_at: string | null
          end_date: string
          equipments_id: number[]
          id: number
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          building_address?: string | null
          client_id: number
          client_reference_id?: number | null
          created_at?: string
          deleted_at?: string | null
          end_date: string
          equipments_id: number[]
          id?: number
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          building_address?: string | null
          client_id?: number
          client_reference_id?: number | null
          created_at?: string
          deleted_at?: string | null
          end_date?: string
          equipments_id?: number[]
          id?: number
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_client_reference_id_fkey"
            columns: ["client_reference_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals_clients: {
        Row: {
          client_id: number
          rental_id: number
        }
        Insert: {
          client_id: number
          rental_id: number
        }
        Update: {
          client_id?: number
          rental_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "rentals_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals_references_clients: {
        Row: {
          client_id: number
          rental_id: number
        }
        Insert: {
          client_id: number
          rental_id: number
        }
        Update: {
          client_id?: number
          rental_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "rentals_references_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_references_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals_users: {
        Row: {
          rental_id: number
          user_id: string
        }
        Insert: {
          rental_id: number
          user_id: string
        }
        Update: {
          rental_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_users_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          rol_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          rol_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          rol_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      all_inventory: {
        Row: {
          cantidad: number | null
          disponibles: number | null
          en_renta: number | null
          id: number[] | null
          referencias: string[] | null
          tipo_herramienta: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
