export interface IGiosgAccessToken {
    organization_id: string;
    scopes: string[];
    version: number;
    jti: string;
    aud: string[];
    exp: number;
    user_id: string;
    iss: string;
    iat: number;
    app_id: string | null;
}

export interface IGiosgDataToken {
    _org_id: number;
    _user_id: number;
    app_id: string;
    app_user_code: string | null;
    app_user_id: string;
    chat_id: string;
    domain_host: string | null;
    exp: number;
    inst_id: string;
    org_id: string;
    room_id: string | null;
    sub: string;
    user_id: string;
    visitor_id: string;
}

export interface IGiosgTokenResponse {
    access_token: string;
    app_id: string;
    organization_id: string;
    token_type: "Token";
    user_id: string;
}

export interface IGiosgPublicAuthResponse {
    visitor_id: string;
    visitor_global_id: string;
    visitor_secret_id: string;
    organization_id: string;
    socket_url: string;
    access_token: string;
    expires_at: Date;
    expires_in: number;
}

export interface IGiosgNestedAvatar {
    id: string;
    url: any;
}

export interface IGiosgNestedChatMessageAttachmentAction {
    id: string;
    text: string;
    type: "button" | "link_button";
    link_target: "_blank" | "_parent";
    value: string;
    style: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "link" | "brand_primary" | "brand_secondary";
    is_disabled_on_selection: boolean;
    is_disabled_on_visitor_message: boolean;
}

export interface IGiosgNestedChatMessageAttachment {
    id: string;
    title: string;
    title_link_url: string;
    text: string;
    image_url: string;
    image_link_url: string;
    link_target: "_blank" | "_parent";
    actions: IGiosgNestedChatMessageAttachmentAction[];
}

export interface IGiosgNestedChatMessageResponseAttachment {
    id: string;
    title: string;
    title_link_url: string;
    text: string;
    image_url: string;
    image_link_url: string;
    link_target: "_blank" | "_parent";
}

export interface IGiosgNestedChatReplySuggestion {
    id: string;
    suggestion: string;
    relevancy_score: number;
    message_id: string;
}

export interface IGiosgChatMessage {
    id: string;
    type: "msg" | "autosuggest" | "join" | "leave" | "shoppingcart_locked" | "action" | "system";
    chat_id: string;
    room_id: string;
    created_at: string;
    sender_type: "user" | "visitor" | "rule";
    sender_id: string;
    sender_public_name: string;
    sender_name: string;
    sender_avatar: IGiosgNestedAvatar;
    message: string;
    is_encrypted: boolean;
    encrypted_message: string;
    sensitive_data_purged_at: string;
    selected_reply_suggestion_id: string;
    selected_reply_suggestion: IGiosgNestedChatReplySuggestion;
    attachments: IGiosgNestedChatMessageAttachment[];
    response_to_message_id: string;
    response_to_attachment_id: string;
    response_to_attachment: IGiosgNestedChatMessageResponseAttachment;
    response_to_action_id: string;
    response_to_action: IGiosgNestedChatMessageAttachmentAction;
    response_value: string;
}

export interface IGiosgChatMembership {
    member_id: string;
    member_type: "user" | "visitor";
    member_name: string;
    member_public_name: string;
    member_avatar: IGiosgNestedAvatar;
    room_id: string;
    chat_id: string;
    created_at: string;
    updated_at: string;
    is_participating: boolean;
    is_present: boolean;
    composing_status: "idle" | "typing" | "typed";
    message_count: number;
    room_organization_id: string;
    member_organization_id: string;
    legacy_member_id: string;
}

export interface IGiosgNestedOrganization {
    id: string;
    name: string;
}

export interface IGiosgNestedUser {
    id: string;
    first_name: string;
    last_name: string;
    full_name: any;
    organization_id: string;
    avatar_id: string;
    avatar: IGiosgNestedAvatar;
    is_bot: boolean;
}

export interface IGiosgRoom {
    id: string;
    name: string;
    display_name: string;
    domain: string;
    token: string;
    language_code: string;
    organization_id: string;
    organization: IGiosgNestedOrganization;
    updated_by_user_id: string;
    updated_by_user: IGiosgNestedUser;
    created_at: string;
    updated_at: string;
    is_online: boolean;
    is_deleted: boolean;
    is_shared: any;
    is_service_hours_enabled: any;
    is_open: any;
}

export interface IGiosgIconAsset {
    id: string;
    url: string;
    kind: "image" | "css" | "javascript" | "font";
    content_type: string;
    size: number;
    charset: string;
    width: number;
    height: number;
}

export interface IGiosgApp {
    id: string;
    name: string;
    description: string;
    icon_asset_id: string;
    icon_asset: IGiosgIconAsset;
    owned_by_organization_id: string;
    owned_by_organization: IGiosgNestedOrganization;
    is_app_user_required: boolean;
    required_scopes: "settings" | "users" | "reports";
    installation_count: number;
    created_at: string;
    updated_at: string;
}

export interface IGiosgAppInstallation {
    id: string;
    app_id: string;
    app: IGiosgApp;
    organization_id: string;
    organization: IGiosgNestedOrganization;
    created_at: string;
    updated_at: string;
    app_user_id: string;
    app_user: IGiosgNestedUser;
    allowed_scopes: "settings" | "users" | "reports";
}

export interface IGiosgChat {
    chat_type: string;
    created_at: string;
    ended_at: null;
    id: string;
    is_autosuggested: false;
    is_encrypted: false;
    is_ended: false;
    is_waiting: false;
    legacy_id: string;
    legacy_room_id: string;
    member_count: number;
    message_count: number;
    present_participant_count: number;
    present_user_participant_count: number;
    present_visitor_participant_count: number;
    room_id: string;
    room_organization_id: string;
    updated_at: string;
    user_member_count: 1;
    user_message_count: number;
    visitor_member_count: 1;
    visitor_message_count: number;
    visitor_wait_time: null;
    waiting_started_at: null;
}

export interface IGiosgRoomVisitorPostResponse {
    id: string;
    room_id: string;
    presence_expires_in: number;
}

export interface IGiosgUserClient {
    id: string;
    presence_expires_in: number;
    presence_expires_at: string;
    is_present: any;
    is_about_to_expire: boolean;
    gcm_token: string;
    properties: any;
    subscribed_channels: string[];
    created_at: string;
    updated_at: string;
}
