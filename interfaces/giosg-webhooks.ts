import { IGiosgChatMembership, IGiosgChatMessage } from "./giosg";

export interface IGiosgWebhook {
    action: "added" | "changed" | "removed";
    channel: string;
    resource_id: string;
}

export interface IGiosgChatMessageAddedWebhook extends IGiosgWebhook {
    action: "added";
    resource: IGiosgChatMessage;
}

export interface IGiosgChatMembershipChangedWebhook extends IGiosgWebhook {
    action: "changed";
    resource: Partial<IGiosgChatMembership>;
}
