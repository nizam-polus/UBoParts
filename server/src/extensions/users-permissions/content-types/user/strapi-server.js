module.exports = (plugin) => {
    plugin.controllers.user.update = async (ctx) => {
        if(!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.ctx = 401;
        }
        await strapi.query('plugin::users-permission.user').update ({
            where: { id: ctx.state.user.id },
            data: ctx.request.body
        }).then((res) => {
            ctx.response.status = 200; 
        })
    }

    plugin.controllers.user.find = async (ctx) => {
        const users = await strapi.entityService.findMany(
          'plugin::users-permissions.user',
          { ...ctx.params, populate: ['role', 'avatar'] }
        );
    
        ctx.body = users.map(user => sanitizeOutput(user));
      };
    
    plugin.routes['content-api'].routes.push(
        {
            method: "PUT",
            path: "/users/id",
            handler: "user.update",
            config: {
                prefix: "",
                policies: []
            }
        }
        
    )

    return plugin;
}
