import axios from "axios";
import bodyParser = require("body-parser");
import { Express, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { capitalize, first } from "lodash";
import path = require("path");
import { Connection, getRepository, Repository } from "typeorm";
import { API_KEY, GIOSG_APP_ID, GIOSG_APP_SECRET, GIOSG_BASE_URL } from "../constants";
import { GiosgAppInstallation } from "../entity/GiosgAppInstallation";
import { GiosgAppInstallationUser } from "../entity/GiosgAppInstallationUser";
import { IGiosgDataToken, IGiosgTokenResponse } from "../interfaces/giosg";

export interface IInstallHandlerOptions {
    appId: string;
    appSecret: string;
    giosgDataToken: string;
    redirectUri: string;
    response: Response;
}

export interface IUninstallHandlerOptions {
    appId: string;
    appSecret: string;
    giosgDataToken: string;
    response: Response;
}

export class Server {
    public server: Express;
    public connection: Connection;
    private giosgAppInstallationRepository: Repository<GiosgAppInstallation>;
    private giosgAppInstallationUserRepository: Repository<GiosgAppInstallationUser>;

    constructor(express: Express, connection: Connection) {
        this.server = express;
        this.connection = connection;
        this.giosgAppInstallationRepository = getRepository(GiosgAppInstallation, connection.name);
        this.giosgAppInstallationUserRepository = getRepository(GiosgAppInstallationUser, connection.name);

        this.defineRoutes();
    }

    private defineRoutes = () => {
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));

        this.server.get("/install", async (request, response) => {
            const { query } = request;
            if (query.type === "install" && query.data && query.redirect_uri) {
                  return await this.handleInstallTrigger({
                      appId: GIOSG_APP_ID,
                      appSecret: GIOSG_APP_SECRET,
                      giosgDataToken: query.data,
                      redirectUri: query.redirect_uri,
                      response,
                  }, this.connection);
              }

            if (query.type === "uninstall" && query.data) {
                  return await this.handleUninstallTrigger({
                      appId: GIOSG_APP_ID,
                      appSecret: GIOSG_APP_SECRET,
                      giosgDataToken: query.data,
                      response,
                  });
              }
            return response.sendStatus(200);
          });

        this.server.get("/chat", async (request, response) => {
            return response.sendFile(path.join(__dirname) + "/giosg.html");
        });

        this.server.post("/webhook", async (request, response) => {
            const { body: { app_user_auth, resource } } = request;
            const { room_id, room_name, id } = resource;
            const { organization_id, user_id } = app_user_auth;
            const existingUser = await this.giosgAppInstallationUserRepository.findOne({ organizationId: organization_id });
            const accessToken = existingUser.accessToken;
            const visitor = await axios.get(`${GIOSG_BASE_URL}/api/v5/users/${user_id}/routed_chats/${id}/memberships`, {
                headers: {
                    Authorization: `Token ${accessToken}`,
                },
            }).then(membershipResponse =>  first(membershipResponse.data.results));

            if (visitor) {
                const { member_id } = visitor;
                const visitorInformation = await axios.get(`${GIOSG_BASE_URL}/api/v5/users/${user_id}/rooms/${room_id}/visitors/${member_id}`, {
                    headers: {
                        Authorization: `Token ${accessToken}`,
                    },
                })
                .then(visitorResponse => visitorResponse.data)
                .catch(e => console.log(e));

                const weatherInformation = await this.getWeatherInformation(visitorInformation);

                weatherInformation.map(async (item) => {
                    await this.addVisitorVariable(item, {
                        accessToken,
                        member_id,
                        organization_id,
                        room_id,
                    });
                });
            }
            return response.sendStatus(200);
        });
    }

    private getWeatherInformation = async (options: any) => {
        const { geo_city, geo_country_code } = options;

        const weatherAPIResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${geo_city}&units=metric&lang=${geo_country_code}&appid=${API_KEY}`)
            .then(apiResponse => apiResponse.data)
            .catch(error => console.log(error));

        const { main: { temp }, weather } = weatherAPIResponse;
        const { description } = first(weather);
        const descWithUpperCase = capitalize(description);
        const integerTemp = temp.toFixed(0);
        const temperature = (Number(integerTemp) > 0) ? "+ " + integerTemp : "- " + integerTemp;

        return [
            {
                key: "Sää",
                value: descWithUpperCase,
            },
            {
                key: "Lämpötila",
                value: temperature + " \xB0C",
            },
        ];
    }

    private addVisitorVariable = async (variable: any, options: any) => {
        const { key, value } = variable;
        const { organization_id, room_id, member_id, accessToken } = options;
        await axios.post(`${GIOSG_BASE_URL}/api/v5/orgs/${organization_id}/rooms/${room_id}/visitors/${member_id}/variables`, { key, value },
            {
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        }).catch(e => console.log(e));
    }

    private handleInstallTrigger = async (options: IInstallHandlerOptions, connection: Connection) => {
        const { appId, appSecret, giosgDataToken, response } = options;
        return await verify(giosgDataToken, appSecret, async (verifyError: any, decodedToken: any) => {
            if (verifyError) {
                return response.sendStatus(401);
            }
            const { app_user_code, app_user_id, inst_id } = decodedToken as IGiosgDataToken;
            const existingUser = await this.giosgAppInstallationUserRepository.findOne({ id: app_user_id });
            if (!existingUser) {
                const body = `grant_type=authorization_code&code=${app_user_code}&client_id=${appId}&client_secret=${appSecret}`;
                return await axios.post(`${GIOSG_BASE_URL}/identity/token`, body, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }).then(async (tokenResponse) => {
                    const { access_token, app_id, organization_id, user_id } = tokenResponse.data as IGiosgTokenResponse;
                    await connection.transaction(async (transactionalEntityManager: any) => {
                        const appInstallation = await transactionalEntityManager.save(GiosgAppInstallation, {
                            appId: app_id,
                            id: inst_id,
                            organizationId: organization_id,
                        });

                        await transactionalEntityManager.save(GiosgAppInstallationUser, {
                            accessToken: access_token,
                            appInstallation,
                            id: user_id,
                            organizationId: appInstallation.organizationId,
                        });

                        return response.sendStatus(200);
                    });
                });
            }
        });
    }
    private handleUninstallTrigger = async (options: IUninstallHandlerOptions) => {
        const { appId, appSecret, giosgDataToken, response } = options;

        return await verify(giosgDataToken, appSecret, async (verifyError: any, decodedToken: any) => {
            if (verifyError) {
                return response.sendStatus(401);
            }
            try {
                const { org_id } = decodedToken as IGiosgDataToken;
                const existingInstallation = await this.giosgAppInstallationRepository.findOne({ appId, organizationId: org_id });
                if (existingInstallation) {
                    // This does cascade remove all the installation related objects from the database
                    // There is also a GiosgAppInstallationSubscriber which does facebook webhook unsubscribing for each page
                    await this.giosgAppInstallationRepository.remove(existingInstallation);
                    return response.sendStatus(204);
                } else {
                    return response.sendStatus(404);
                }
            } catch (error) {
                return response.sendStatus(500);
            }
        });
    }
}
