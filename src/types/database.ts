export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          riot_game_name: string | null;
          riot_tag_line: string | null;
          preferred_role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          riot_game_name?: string | null;
          riot_tag_line?: string | null;
          preferred_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          riot_game_name?: string | null;
          riot_tag_line?: string | null;
          preferred_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tracked_players: {
        Row: {
          id: string;
          profile_id: string;
          puuid: string;
          game_name: string;
          tag_line: string;
          platform_route: string;
          is_favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          puuid: string;
          game_name: string;
          tag_line: string;
          platform_route?: string;
          is_favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          puuid?: string;
          game_name?: string;
          tag_line?: string;
          platform_route?: string;
          is_favorite?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      match_snapshots: {
        Row: {
          id: string;
          tracked_player_id: string;
          match_id: string;
          queue_id: number | null;
          champion_name: string | null;
          lane: string | null;
          result: string | null;
          kda: string | null;
          game_duration_seconds: number | null;
          played_at: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_player_id: string;
          match_id: string;
          queue_id?: number | null;
          champion_name?: string | null;
          lane?: string | null;
          result?: string | null;
          kda?: string | null;
          game_duration_seconds?: number | null;
          played_at?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_player_id?: string;
          match_id?: string;
          queue_id?: number | null;
          champion_name?: string | null;
          lane?: string | null;
          result?: string | null;
          kda?: string | null;
          game_duration_seconds?: number | null;
          played_at?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      pregame_reports: {
        Row: {
          id: string;
          tracked_player_id: string;
          champion_name: string;
          enemy_champion_name: string;
          lane: string;
          risk_score: number;
          tags: string[];
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_player_id: string;
          champion_name: string;
          enemy_champion_name: string;
          lane: string;
          risk_score: number;
          tags?: string[];
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_player_id?: string;
          champion_name?: string;
          enemy_champion_name?: string;
          lane?: string;
          risk_score?: number;
          tags?: string[];
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      live_snapshots: {
        Row: {
          id: string;
          tracked_player_id: string;
          game_id: string | null;
          source: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_player_id: string;
          game_id?: string | null;
          source: string;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_player_id?: string;
          game_id?: string | null;
          source?: string;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      postgame_reports: {
        Row: {
          id: string;
          tracked_player_id: string;
          match_snapshot_id: string | null;
          summary: string | null;
          positives: string[];
          improvements: string[];
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_player_id: string;
          match_snapshot_id?: string | null;
          summary?: string | null;
          positives?: string[];
          improvements?: string[];
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_player_id?: string;
          match_snapshot_id?: string | null;
          summary?: string | null;
          positives?: string[];
          improvements?: string[];
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      build_recommendations: {
        Row: {
          id: string;
          tracked_player_id: string;
          report_type: "pregame" | "live" | "postgame";
          report_id: string;
          champion_name: string;
          lane: string | null;
          option_label: string;
          item_path: string[];
          rationale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_player_id: string;
          report_type: "pregame" | "live" | "postgame";
          report_id: string;
          champion_name: string;
          lane?: string | null;
          option_label: string;
          item_path?: string[];
          rationale: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_player_id?: string;
          report_type?: "pregame" | "live" | "postgame";
          report_id?: string;
          champion_name?: string;
          lane?: string | null;
          option_label?: string;
          item_path?: string[];
          rationale?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      champion_profiles: {
        Row: {
          id: string;
          champion_name: string;
          primary_role: string;
          damage_profile: string;
          lane_style: string;
          scaling_profile: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          champion_name: string;
          primary_role: string;
          damage_profile: string;
          lane_style: string;
          scaling_profile: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          champion_name?: string;
          primary_role?: string;
          damage_profile?: string;
          lane_style?: string;
          scaling_profile?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
