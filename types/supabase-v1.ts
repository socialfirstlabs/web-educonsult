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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      blog_translations: {
        Row: {
          blog_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          locale: string
          slug: string
          title: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale: string
          slug: string
          title: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale?: string
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_translations_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      course_translations: {
        Row: {
          badge: string | null
          course_id: string
          created_at: string | null
          description: string
          duration: string | null
          fees: string | null
          id: string
          locale: string
          schedule: string | null
          title: string
        }
        Insert: {
          badge?: string | null
          course_id: string
          created_at?: string | null
          description: string
          duration?: string | null
          fees?: string | null
          id?: string
          locale: string
          schedule?: string | null
          title: string
        }
        Update: {
          badge?: string | null
          course_id?: string
          created_at?: string | null
          description?: string
          duration?: string | null
          fees?: string | null
          id?: string
          locale?: string
          schedule?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          badge: string | null
          created_at: string | null
          description: string
          duration: string
          fees: string
          id: string
          is_published: boolean | null
          order_index: number | null
          schedule: string
          title: string
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          description: string
          duration: string
          fees: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          schedule: string
          title: string
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          description?: string
          duration?: string
          fees?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          schedule?: string
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          japanese_level: string
          last_name: string
          phone: string
          program_interest: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          japanese_level: string
          last_name: string
          phone: string
          program_interest: string
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          japanese_level?: string
          last_name?: string
          phone?: string
          program_interest?: string
          status?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      service_translations: {
        Row: {
          created_at: string | null
          description: string
          features: string | null
          id: string
          locale: string
          service_id: string
          tags: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: string | null
          id?: string
          locale: string
          service_id: string
          tags?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: string | null
          id?: string
          locale?: string
          service_id?: string
          tags?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_translations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          features: string | null
          icon_name: string
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number
          tags: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: string | null
          icon_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index: number
          tags?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: string | null
          icon_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number
          tags?: string | null
          title?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          created_at: string | null
          destination: string
          id: string
          image_url: string | null
          is_published: boolean | null
          student_name: string
          testimonial: string | null
          company_name: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          student_name: string
          testimonial?: string | null
          company_name?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          student_name?: string
          testimonial?: string | null
          company_name?: string | null
        }
        Relationships: []
      }
      success_story_translations: {
        Row: {
          created_at: string | null
          destination: string
          id: string
          locale: string
          student_name: string
          success_story_id: string
          testimonial: string | null
          company_name: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          id?: string
          locale: string
          student_name: string
          success_story_id: string
          testimonial?: string | null
          company_name?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          id?: string
          locale?: string
          student_name?: string
          success_story_id?: string
          testimonial?: string | null
          company_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_story_translations_success_story_id_fkey"
            columns: ["success_story_id"]
            isOneToOne: false
            referencedRelation: "success_stories"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
