const cors = require("fastify-cors");
const fastify = require("fastify");
const autoload = require("@fastify/autoload");
const path = require("path");

const buildApp = async (fastifyOpts = {}, pluginOpts = {}) => {
    const app = fastify(fastifyOpts);

    await app.register(cors, {
        // put your options here
        origin: true,
    });

    // load high-priority plugins
    // high-priority = plugins that other plugins depend on
    await app.register(require("./plugins/sensible"), {
        options: pluginOpts,
    });
    await app.register(require("./plugins/prisma"), {
        options: pluginOpts,
    });

    // autoload plugins
    app.register(autoload, {
        dir: path.join(__dirname, "plugins"),
        options: pluginOpts,
        ignorePattern: /(sensible|prisma).js/,
    });

    // autoload routes
    app.register(autoload, {
        dir: path.join(__dirname, "routes"),
        options: Object.assign(
            {
                prefix: "/api",
            },
            pluginOpts
        ),
    });

    return app;
};

module.exports = buildApp;
