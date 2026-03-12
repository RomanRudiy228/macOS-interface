export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      apps: {
        Row: {
          app_key: string;
          icon: string;
          id: string;
          name: string;
        };
        Insert: {
          app_key: string;
          icon: string;
          id?: string;
          name: string;
        };
        Update: {
          app_key?: string;
          icon?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string | null;
          id: string;
          last_message_content: string | null;
          last_message_created_at: string | null;
          last_message_sender_id: string | null;
          last_seen_at: string | null;
          participant_1_id: string;
          participant_2_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          last_message_content?: string | null;
          last_message_created_at?: string | null;
          last_message_sender_id?: string | null;
          last_seen_at?: string | null;
          participant_1_id: string;
          participant_2_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          last_message_content?: string | null;
          last_message_created_at?: string | null;
          last_message_sender_id?: string | null;
          last_seen_at?: string | null;
          participant_1_id?: string;
          participant_2_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      dock_items: {
        Row: {
          app_key: string;
          id: string;
          is_locked: boolean;
          position: number;
          user_id: string | null;
        };
        Insert: {
          app_key: string;
          id?: string;
          is_locked?: boolean;
          position: number;
          user_id?: string | null;
        };
        Update: {
          app_key?: string;
          id?: string;
          is_locked?: boolean;
          position?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dock_items_app_key_fkey";
            columns: ["app_key"];
            isOneToOne: false;
            referencedRelation: "apps";
            referencedColumns: ["app_key"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string | null;
          id: string;
          is_edited: boolean | null;
          sender_id: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string | null;
          id?: string;
          is_edited?: boolean | null;
          sender_id: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string | null;
          id?: string;
          is_edited?: boolean | null;
          sender_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          avatar_url: string | null;
          created_at: string;
          email: string;
          id: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar_path?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          id: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar_path?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: number;
          system_color: string | null;
          theme: string | null;
          user_id: string | null;
          wallpaper_id: string | null;
        };
        Insert: {
          id?: never;
          system_color?: string | null;
          theme?: string | null;
          user_id?: string | null;
          wallpaper_id?: string | null;
        };
        Update: {
          id?: never;
          system_color?: string | null;
          theme?: string | null;
          user_id?: string | null;
          wallpaper_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "settings_system_color_fkey";
            columns: ["system_color"];
            isOneToOne: false;
            referencedRelation: "system_colors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "settings_theme_fkey";
            columns: ["theme"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "settings_wallpaper_id_fkey";
            columns: ["wallpaper_id"];
            isOneToOne: false;
            referencedRelation: "wallpapers";
            referencedColumns: ["id"];
          },
        ];
      };
      system_colors: {
        Row: {
          css: string;
          id: string;
          name: string;
        };
        Insert: {
          css: string;
          id: string;
          name: string;
        };
        Update: {
          css?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      wallpapers: {
        Row: {
          background_image: string;
          id: string;
          name: string;
        };
        Insert: {
          background_image: string;
          id: string;
          name: string;
        };
        Update: {
          background_image?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      widget_positions: {
        Row: {
          updated_at: string;
          user_id: string;
          widget_id: string;
          x: number;
          y: number;
        };
        Insert: {
          updated_at?: string;
          user_id: string;
          widget_id: string;
          x: number;
          y: number;
        };
        Update: {
          updated_at?: string;
          user_id?: string;
          widget_id?: string;
          x?: number;
          y?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      mark_conversation_seen: {
        Args: { conversation_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
