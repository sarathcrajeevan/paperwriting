export var editorXBundlesConfig = {
    parts: false,
    components: false,
    host: true,
};
export var editorXConventions = {
    patterns: [{
            part: 'externalComponentEditor',
            path: '{,*/}editor/%ComponentName%.responsiveMetadata.ts',
        },
        {
            part: 'componentAddPanel',
            path: '{,*/}editor/%ComponentName%.responsiveAddPanel.ts',
        },
        {
            part: 'translations',
            path: '{,*/}editor/%ComponentName%.translations.ts',
        },
    ],
};
//# sourceMappingURL=editorX.js.map