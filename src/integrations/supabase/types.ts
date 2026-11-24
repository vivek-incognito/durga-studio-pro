export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_invites: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          hours: string
          id: string
          is_active: boolean
          is_main: boolean
          maps_url: string
          name: string
          phone: string
          sort_order: number
          updated_at: string
          whatsapp: string
          whatsapp_alt: string
        }
        Insert: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          hours?: string
          id?: string
          is_active?: boolean
          is_main?: boolean
          maps_url?: string
          name: string
          phone?: string
          sort_order?: number
          updated_at?: string
          whatsapp?: string
          whatsapp_alt?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          hours?: string
          id?: string
          is_active?: boolean
          is_main?: boolean
          maps_url?: string
          name?: string
          phone?: string
          sort_order?: number
          updated_at?: string
          whatsapp?: string
          whatsapp_alt?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          mobile: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          mobile: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          mobile?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"]
          created_at: string
          description: string
          id: string
          image_url: string
          is_sample: boolean
          sort_order: number
          storage_path: string | null
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string
          id?: string
          image_url: string
          is_sample?: boolean
          sort_order?: number
          storage_path?: string | null
          title?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_sample?: boolean
          sort_order?: number
          storage_path?: string | null
          title?: string
        }
        Relationships: []
      }
      order_files: {
        Row: {
          created_at: string
          file_name: string
          id: string
          label: string
          mime_type: string
          order_id: string
          order_item_id: string | null
          size_bytes: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          label?: string
          mime_type: string
          order_id: string
          order_item_id?: string | null
          size_bytes?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          label?: string
          mime_type?: string
          order_id?: string
          order_item_id?: string | null
          size_bytes?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_files_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          id: string
          item_notes: string
          line_total: number
          order_id: string
          price_is_starting: boolean
          price_unit: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          item_notes?: string
          line_total: number
          order_id: string
          price_is_starting?: boolean
          price_unit?: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          item_notes?: string
          line_total?: number
          order_id?: string
          price_is_starting?: boolean
          price_unit?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          author_email: string
          author_id: string | null
          created_at: string
          id: string
          note: string
          order_id: string
        }
        Insert: {
          author_email?: string
          author_id?: string | null
          created_at?: string
          id?: string
          note: string
          order_id: string
        }
        Update: {
          author_email?: string
          author_id?: string | null
          created_at?: string
          id?: string
          note?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          branch_id: string | null
          branch_name: string
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_notes: string
          email: string
          id: string
          mobile: string
          order_code: string
          preferred_date: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          branch_name?: string
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_notes?: string
          email?: string
          id?: string
          mobile: string
          order_code: string
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          branch_name?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_notes?: string
          email?: string
          id?: string
          mobile?: string
          order_code?: string
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          name: string
          price: number
          price_is_starting: boolean
          price_unit: string
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
          upload_kind: Database["public"]["Enums"]["upload_kind"]
          upload_required: boolean
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name: string
          price?: number
          price_is_starting?: boolean
          price_unit?: string
          short_description?: string
          slug: string
          sort_order?: number
          updated_at?: string
          upload_kind?: Database["public"]["Enums"]["upload_kind"]
          upload_required?: boolean
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          price?: number
          price_is_starting?: boolean
          price_unit?: string
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          upload_kind?: Database["public"]["Enums"]["upload_kind"]
          upload_required?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order: {
        Args: { p_branch_id: string; p_customer: Json; p_items: Json }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_mobile: { Args: { p: string }; Returns: string }
      track_order: {
        Args: { p_mobile: string; p_order_code: string }
        Returns: Json
      }
      update_order_status: {
        Args: {
          p_note: string
          p_order_id: string
          p_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin"
      gallery_category:
        | "passport"
        | "frames"
        | "banners"
        | "wedding"
        | "birthday"
        | "engagement"
        | "videography"
        | "albums"
      order_status:
        | "received"
        | "pending_confirmation"
        | "confirmed"
        | "in_production"
        | "ready_for_pickup"
        | "completed"
        | "cancelled"
      product_category: "passport" | "frames" | "banners" | "events"
      upload_kind: "none" | "passport" | "frame" | "banner" | "event"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      gallery_category: [
        "passport",
        "frames",
        "banners",
        "wedding",
        "birthday",
        "engagement",
        "videography",
        "albums",
      ],
      order_status: [
        "received",
        "pending_confirmation",
        "confirmed",
        "in_production",
        "ready_for_pickup",
        "completed",
        "cancelled",
      ],
      product_category: ["passport", "frames", "banners", "events"],
      upload_kind: ["none", "passport", "frame", "banner", "event"],
    },
  },
} as const
