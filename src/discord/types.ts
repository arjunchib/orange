export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: Footer;
  author?: Author;
}

export interface Footer {
  text: string;
}

export interface Author {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface WebhookResponse {
  type: number;
  content: string;
  mentions: [];
  mention_roles: [];
  attachments: [];
  embeds: [];
  timestamp: string;
  edited_timestamp: null;
  flags: number;
  components: [];
  id: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    bot: boolean;
    global_name: null;
    clan: null;
  };
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  webhook_id: string;
}
