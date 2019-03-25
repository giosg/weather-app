import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(["id", "organizationId"])
@Unique(["appId", "organizationId"])
export class GiosgAppInstallation {

    // Should be same as app installation id in giosg system
    @PrimaryColumn({
        readonly: true,
        type: "uuid",
    })
    public id: string;

    @Column({
        readonly: true,
        type: "uuid",
    })
    public appId: string;

    @Column({
        readonly: true,
        type: "uuid",
    })
    public organizationId: string;

    @Column({
        default: false,
        type: "boolean",
    })
    public isDisabled: boolean;

    @CreateDateColumn({
        readonly: true,
        type: "timestamptz",
    })
    public createdAt: Date;
}
