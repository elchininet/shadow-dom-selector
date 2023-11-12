module.exports = {
    files: 'dist/index.d.ts',
    from: /export \{.*/,
    to: 'export = ShadowDomSelector;',
};