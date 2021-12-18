export const editorAutomationsClientCreator = ({
    httpClient
}) => ({
    publishEditorFormsToAutomation: async ({
        forms
    }) => {
        const url = `/_api/wix-form-builder-web/v1/publish-site`
        await httpClient
            .post(
                url, {
                    forms
                }, {
                    headers: {
                        'X-Wix-Client-Artifact-Id': 'wix-code-automations-client',
                    },
                },
            )
            .catch(error => {
                if (error.response) {
                    throw new Error(
                        `Fetch exception at publishEditorFormsToAutomation: Error: Server error on automations endpoint | status: ${error.response?.status} | statusText: "${error.response?.statusText}"`,
                    )
                }
                throw new Error(
                    `Fetch exception at publishEditorFormsToAutomation: ${error.message}`,
                )
            })
    },
})