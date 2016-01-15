Package.describe({
    name: 'wenzhixin:bootstrap-table',
    version: '1.9.1',
    // Brief, one-line summary of the package.
    summary: 'Bootstrap table with radio, checkbox, sort, pagination, and other added features.',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/wenzhixin/bootstrap-table.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.addFiles([
        'dist/bootstrap-table.js',
        'dist/bootstrap-table.css'
    ], 'client');
});
