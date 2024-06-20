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
          anio: string
          cantidad: string
          cliente: string
          cliente_firma: string
          concepto: string
          created_at: string
          dia: string
          estatus: string
          factura: string
          fecha_extension: string
          fecha_vencimiento: string
          forma_pago: string
          id: number
          iva: string
          mes: string
          razon_social: string
          recibidor: string
          ref_contrato: string
          rent_id: number
          sub_total: string
          total: string
        }
        Insert: {
          anio: string
          cantidad: string
          cliente: string
          cliente_firma: string
          concepto: string
          created_at?: string
          dia: string
          estatus: string
          factura: string
          fecha_extension: string
          fecha_vencimiento: string
          forma_pago: string
          id?: number
          iva: string
          mes: string
          razon_social: string
          recibidor: string
          ref_contrato: string
          rent_id: number
          sub_total: string
          total: string
        }
        Update: {
          anio?: string
          cantidad?: string
          cliente?: string
          cliente_firma?: string
          concepto?: string
          created_at?: string
          dia?: string
          estatus?: string
          factura?: string
          fecha_extension?: string
          fecha_vencimiento?: string
          forma_pago?: string
          id?: number
          iva?: string
          mes?: string
          razon_social?: string
          recibidor?: string
          ref_contrato?: string
          rent_id?: number
          sub_total?: string
          total?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_rent_id_fkey"
            columns: ["rent_id"]
            isOneToOne: false
            referencedRelation: "all_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_rent_id_fkey"
            columns: ["rent_id"]
            isOneToOne: false
            referencedRelation: "all_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_rent_id_fkey"
            columns: ["rent_id"]
            isOneToOne: false
            referencedRelation: "rental_to_edit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_rent_id_fkey"
            columns: ["rent_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
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
          isBanned: boolean | null
          isForeign: boolean
          last_name: string
          license: string | null
          name: string
          phone: string | null
          rfc: string | null
          strikes: number | null
          type: number
          updated_at: string
          urls: string[] | null
          voter_code: string | null
        }
        Insert: {
          address?: string
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isBanned?: boolean | null
          isForeign?: boolean
          last_name?: string
          license?: string | null
          name?: string
          phone?: string | null
          rfc?: string | null
          strikes?: number | null
          type?: number
          updated_at?: string
          urls?: string[] | null
          voter_code?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          isBanned?: boolean | null
          isForeign?: boolean
          last_name?: string
          license?: string | null
          name?: string
          phone?: string | null
          rfc?: string | null
          strikes?: number | null
          type?: number
          updated_at?: string
          urls?: string[] | null
          voter_code?: string | null
        }
        Relationships: []
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
          created_at: string
          deleted_at: string | null
          dimension: number | null
          id: number
          reference: string | null
          status: number
          type: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          dimension?: number | null
          id?: number
          reference?: string | null
          status?: number
          type?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          dimension?: number | null
          id?: number
          reference?: string | null
          status?: number
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_dimension_fkey"
            columns: ["dimension"]
            isOneToOne: false
            referencedRelation: "equipment_dimension"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "equipment_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "grouped_inventory"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "equipment_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["value"]
          },
        ]
      }
      equipment_dimension: {
        Row: {
          dimension_name: string
          id: number
          id_type: number
        }
        Insert: {
          dimension_name: string
          id?: number
          id_type: number
        }
        Update: {
          dimension_name?: string
          id?: number
          id_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipment_dimension_id_type_fkey"
            columns: ["id_type"]
            isOneToOne: false
            referencedRelation: "equipment_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_dimension_id_type_fkey"
            columns: ["id_type"]
            isOneToOne: false
            referencedRelation: "grouped_inventory"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "equipment_dimension_id_type_fkey"
            columns: ["id_type"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["value"]
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
          {
            foreignKeyName: "equipments_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "grouped_inventory"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "equipments_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["value"]
          },
        ]
      }
      logs: {
        Row: {
          action: string | null
          client_id: number | null
          created_at: string
          id: number
          note: string | null
          status: Database["public"]["Enums"]["log_status"] | null
          user_id: string
        }
        Insert: {
          action?: string | null
          client_id?: number | null
          created_at?: string
          id?: number
          note?: string | null
          status?: Database["public"]["Enums"]["log_status"] | null
          user_id: string
        }
        Update: {
          action?: string | null
          client_id?: number | null
          created_at?: string
          id?: number
          note?: string | null
          status?: Database["public"]["Enums"]["log_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
      prices: {
        Row: {
          equipment_id: number
          price_days: number | null
          price_week: number | null
          type_id: number
        }
        Insert: {
          equipment_id: number
          price_days?: number | null
          price_week?: number | null
          type_id: number
        }
        Update: {
          equipment_id?: number
          price_days?: number | null
          price_week?: number | null
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "prices_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "equipment_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "grouped_inventory"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "prices_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["value"]
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
            referencedRelation: "all_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_equipments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "all_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_equipments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rental_to_edit"
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
          advance_payment: string | null
          building_address: string | null
          client_id: number
          client_reference_id: number | null
          created_at: string
          deleted_at: string | null
          end_date: string
          equipments_id: number[]
          id: number
          items_returned: boolean | null
          paid: number
          status: string
          total_cost: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advance_payment?: string | null
          building_address?: string | null
          client_id: number
          client_reference_id?: number | null
          created_at?: string
          deleted_at?: string | null
          end_date: string
          equipments_id: number[]
          id?: number
          items_returned?: boolean | null
          paid?: number
          status: string
          total_cost: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advance_payment?: string | null
          building_address?: string | null
          client_id?: number
          client_reference_id?: number | null
          created_at?: string
          deleted_at?: string | null
          end_date?: string
          equipments_id?: number[]
          id?: number
          items_returned?: boolean | null
          paid?: number
          status?: string
          total_cost?: string
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
            referencedRelation: "all_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "all_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rental_to_edit"
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
            referencedRelation: "all_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_references_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "all_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_references_clients_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rental_to_edit"
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
            referencedRelation: "all_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_users_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "all_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_users_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rental_to_edit"
            referencedColumns: ["id"]
          },
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
      total_rentas: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
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
      all_bills: {
        Row: {
          cliente: string | null
          costo_total: string | null
          equipo: Json | null
          estado_actual: string | null
          fecha_final: string | null
          fecha_inicial: string | null
          id: number | null
          recibos: Json | null
          telefono: string | null
        }
        Relationships: []
      }
      all_inventory: {
        Row: {
          cantidad: number | null
          dimensión: string | null
          disponibles: number | null
          en_renta: number | null
          id: number[] | null
          referencias: string[] | null
          tipo_herramienta: string | null
        }
        Relationships: []
      }
      all_logs: {
        Row: {
          acción: string | null
          cliente: string | null
          estado: Database["public"]["Enums"]["log_status"] | null
          fecha: string | null
          nota: string | null
          usuario: string | null
        }
        Insert: {
          acción?: string | null
          cliente?: never
          estado?: Database["public"]["Enums"]["log_status"] | null
          fecha?: never
          nota?: string | null
          usuario?: never
        }
        Update: {
          acción?: string | null
          cliente?: never
          estado?: Database["public"]["Enums"]["log_status"] | null
          fecha?: never
          nota?: string | null
          usuario?: never
        }
        Relationships: []
      }
      all_rentals: {
        Row: {
          anticipo: string | null
          arrendatario: string | null
          cliente: string | null
          cliente_tel: string | null
          costo_total: string | null
          deleted_at: string | null
          dirección: string | null
          equipo: Json | null
          estado_actual: string | null
          fecha_final: string | null
          fecha_inicial: string | null
          formdata: Json | null
          id: number | null
          iscompleted: boolean | null
          pagado: string | null
        }
        Relationships: []
      }
      grouped_inventory: {
        Row: {
          count: number | null
          dimension_id: number | null
          dimension_name: string | null
          equipment_id: number[] | null
          price_days: number | null
          price_week: number | null
          reference: string | null
          type_id: number | null
          type_name: string | null
        }
        Relationships: []
      }
      home_view: {
        Row: {
          calls: number | null
          client_count: number | null
          clients: string[] | null
          pending_payments: Json | null
          rental_count: number | null
          rentals_info: Json | null
          timeout_count: number | null
          user_count: number | null
        }
        Relationships: []
      }
      inventory_types: {
        Row: {
          label: string | null
          value: number | null
        }
        Insert: {
          label?: string | null
          value?: number | null
        }
        Update: {
          label?: string | null
          value?: number | null
        }
        Relationships: []
      }
      rental_to_edit: {
        Row: {
          advance_payment: string | null
          building_address: string | null
          client_id: number | null
          end_date: string | null
          equipments: Json | null
          id: number | null
        }
        Insert: {
          advance_payment?: string | null
          building_address?: string | null
          client_id?: number | null
          end_date?: string | null
          equipments?: never
          id?: number | null
        }
        Update: {
          advance_payment?: string | null
          building_address?: string | null
          client_id?: number | null
          end_date?: string | null
          equipments?: never
          id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      actualizar_rentas_vencidas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_equipment_dimension: {
        Args: {
          rental_id: number
          dimension_id: number
        }
        Returns: boolean
      }
      count_equipment_type: {
        Args: {
          rental_id: number
          type_text: string
        }
        Returns: number
      }
    }
    Enums: {
      log_status: "COMPLETADO" | "INCOMPLETO"
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
