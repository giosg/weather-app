// describe("Server", () => {
//     let connection: Connection;
//     const expressApplication = express();

//     before(async () => {
//         connection = await createConnection("postgres-test");
//     });
//     after(() => {
//         connection.close();
//     });
//     beforeEach(async () => {
//         await connection.dropDatabase();
//         await connection.runMigrations();
//         facebookPageRepository = connection.getRepository(FacebookPage);
//         facebookPageRoomLinkRepository = connection.getRepository(FacebookPageRoomLink);
//         giosgAppInstallationRepository = connection.getRepository(GiosgAppInstallation);
//         giosgAppInstallationUserRepository = connection.getRepository(GiosgAppInstallationUser);
//         giosgAppInstallationVisitorRepository = connection.getRepository(GiosgAppInstallationVisitor);

//         server = new Server(expressApplication, connection, statsd);
//     });
// });
