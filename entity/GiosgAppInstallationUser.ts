import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { GiosgAppInstallation } from "./GiosgAppInstallation";

@Entity()
@Unique(["id", "appInstallationId"])
export class GiosgAppInstallationUser {

    // Should be same as app user id in giosg system
    @PrimaryColumn({
        readonly: true,
        type: "uuid",
    })
    public id: string;

    // Should be same as app installation's organizationId
    @Column({
        readonly: true,
        type: "uuid",
    })
    public organizationId: string;

    @Column({
        readonly: true,
        type: "text",
    })
    public accessToken: string;

    @CreateDateColumn({
        readonly: true,
        type: "timestamptz",
    })
    public createdAt: Date;

    @Column({
        nullable: true,
        type: "uuid",
    })
    public userClientId: string;

    @Column({
        nullable: true,
        type: "timestamptz",
    })
    public userClientPresenceExpiresAt: Date;

    @Column({
        readonly: true,
        type: "uuid",
    })
    public appInstallationId: string;

    @OneToOne(type => GiosgAppInstallation, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    public appInstallation: GiosgAppInstallation;
}
