export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
        Relationships: [
          {
            foreignKeyName: 'bills_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rental-equipment'
            referencedColumns: ['id']
          }
        ]
      }
      'client-status': {
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
          building_address: string
          created_at: string
          deleted_at: string | null
          email: string | null
          id: number
          isForeing: boolean
          last_name: string
          name: string
          phone: number | null
          status: number
          type: number
          updated_at: string
        }
        Insert: {
          address?: string
          building_address?: string
          created_at: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isForeing?: boolean
          last_name?: string
          name?: string
          phone?: number | null
          status?: number
          type?: number
          updated_at?: string
        }
        Update: {
          address?: string
          building_address?: string
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isForeing?: boolean
          last_name?: string
          name?: string
          phone?: number | null
          status?: number
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clients_status_fkey'
            columns: ['status']
            isOneToOne: false
            referencedRelation: 'client-status'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clients_type_fkey'
            columns: ['type']
            isOneToOne: false
            referencedRelation: 'clients-type'
            referencedColumns: ['id']
          }
        ]
      }
      'clients-calls': {
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
            foreignKeyName: 'client-calls_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          }
        ]
      }
      'clients-type': {
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
        Relationships: [
          {
            foreignKeyName: 'contracts_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rental-equipment'
            referencedColumns: ['id']
          }
        ]
      }
      equipment: {
        Row: {
          amount: number
          available: number
          created_at: string
          deleted_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          amount?: number
          available?: number
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          available?: number
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: 'payments_bill_id_fkey'
            columns: ['bill_id']
            isOneToOne: false
            referencedRelation: 'bills'
            referencedColumns: ['id']
          }
        ]
      }
      'rental-equipment': {
        Row: {
          end_date: string | null
          equipment_id: number | null
          id: number
          rental_id: number | null
        }
        Insert: {
          end_date?: string | null
          equipment_id?: number | null
          id?: number
          rental_id?: number | null
        }
        Update: {
          end_date?: string | null
          equipment_id?: number | null
          id?: number
          rental_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'rental-equipment_equipment_id_fkey'
            columns: ['equipment_id']
            isOneToOne: false
            referencedRelation: 'equipment'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rental-equipment_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rentals'
            referencedColumns: ['id']
          }
        ]
      }
      rentals: {
        Row: {
          client_id: number
          created_at: string
          delete_at: string | null
          id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          client_id: number
          created_at?: string
          delete_at?: string | null
          id?: number
          updated_at?: string
          user_id: number
        }
        Update: {
          client_id?: number
          created_at?: string
          delete_at?: string | null
          id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'rentals_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          }
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
            foreignKeyName: 'user_roles_rol_id_fkey'
            columns: ['rol_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
