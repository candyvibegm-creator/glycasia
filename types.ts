export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  image?: string; // base64 string for displayed images
  isError?: boolean;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  systemInstruction?: string; // Custom training prompt for this session
  updatedAt: number;
}

export enum AppMode {
  CHAT = 'chat',
  IMAGE_GEN = 'image_gen',
  IMAGE_EDIT = 'image_edit'
}

export interface AspectRatioOption {
  label: string;
  value: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: "1:1 (Square)", value: "1:1" },
  { label: "16:9 (Landscape)", value: "16:9" },
  { label: "9:16 (Portrait)", value: "9:16" },
  { label: "4:3 (Standard)", value: "4:3" },
  { label: "3:4 (Portrait Standard)", value: "3:4" },
];