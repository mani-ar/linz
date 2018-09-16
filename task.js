const renderWidget = () => {

    return (data, req, res,callback) => ({

        render: () => new Promise((resolve, reject) => {
                // Namespace this request object.
				namespaceMiddleware(req, {}, () => {

					attributesMiddleware(req, {}, () => {

						renderNotifications(req, (err, notifications) => {

							if (err) {
								return reject(err);
							}

							// Retrieve navigation suitable for the user.
							linz.api.navigation.get(req, (err, navigation) => {

								if (err) {
									return reject(err);
								}

								Promise.all([
									getScripts(req, res),
									getStyles(req, res),
								])
									.then(([scripts, styles]) => {

										const appLocals = {
											customAttributes: req.locals.customAttributes,
											linzNavigation: navigation,
											scripts,
											styles,
											template: 'wrapper',
										};

										if (notifications) {
											appLocals.notifications = notifications;
										}

										const locals = utils.merge(appLocals, clone(data) || {});
										const view = viewPath(locals.template + '.jade');

										if (!view) {
											return reject(new Error('Could not find template.'));
										}

										// If a callback function is provided, render the view and return the results.
										if (typeof callback === 'function') {
											return resolve(linz.app.render(view, locals, callback));
										}

										// If we get to this point, assume callback is a res object.
										return resolve(res.render(view, locals)));

									})
									.catch(err)(
									    return reject(err);
									}

							});

						});

					});

				});

        })

    });

}
