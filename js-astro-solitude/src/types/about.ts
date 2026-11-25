import type { IconName } from '@/lib/icons';

interface SectionBase {
  enabled?: boolean;
}

interface IntroSection extends SectionBase {
  type: 'intro';
  greeting?: string;
  name_prefix?: string;
  name?: string;
  description?: string;
  pursuit?: { label?: string; lines?: string[]; rotating_words?: string[] };
}

interface SkillsCareerSection extends SectionBase {
  type: 'skills_career';
  skills?: {
    label?: string;
    title?: string;
    items?: { name: string; icon?: IconName; image?: string; color?: string }[];
  };
  career?: {
    label?: string;
    title?: string;
    summary?: { name: string; color?: string }[];
    timeline?: {
      start: number;
      end: number;
      start_label?: string | number;
      end_label?: string | number;
      track_label?: string;
      aria_label?: string;
      events?: {
        label: string;
        from: number;
        to?: number;
        period?: string;
        color?: string;
      }[];
    };
  };
}

interface PersonalityPhotoSection extends SectionBase {
  type: 'personality_photo';
  personality?: {
    label?: string;
    title?: string;
    type?: string;
    color?: string;
    image?: string;
    image_alt?: string;
    link?: { text: string; url: string; external?: boolean };
  };
  photo?: { image: string; alt?: string; badge?: string };
}

interface ValuesSection extends SectionBase {
  type: 'values';
  motto?: { label?: string; prefix?: string; content?: string };
  expertise?: {
    label?: string;
    prefix?: string;
    specialist?: string;
    content?: string;
    level?: string;
  };
}

interface InterestsSection extends SectionBase {
  type: 'interests';
  items?: {
    variant?: 'game' | 'media';
    label?: string;
    title?: string;
    title_lines?: string[];
    subtitle?: string;
    background: string;
    color?: string;
    mode?: { name: string; image?: string; tooltip?: string };
    heroes?: { name: string; image: string }[];
    right_text?: string;
    right_tip?: string;
    button?: { text: string; url: string; icon?: IconName; external?: boolean };
  }[];
}

interface StatsProfileSection extends SectionBase {
  type: 'stats_profile';
  statistics?: {
    label?: string;
    title?: string;
    background?: string;
    metrics?: { label: string; field: string; fallback?: string | number }[];
    button?: { url: string; text: string };
    source?: { url?: string; response_path?: string };
  };
  location?: {
    label?: string;
    title?: string;
    map_light?: string;
    map_dark?: string;
  };
  profile?: {
    label?: string;
    title?: string;
    items?: { icon?: IconName; label: string; value: string }[];
  };
}

interface StorySection extends SectionBase {
  type: 'story';
  label?: string;
  title?: string;
  content?: string;
}

export type AboutSection =
  | IntroSection
  | SkillsCareerSection
  | PersonalityPhotoSection
  | ValuesSection
  | InterestsSection
  | StatsProfileSection
  | StorySection;

export interface AboutData {
  title?: string;
  sections: AboutSection[];
}
