import uuid from 'uuid'

export const viewerAutomationsClientCreator = ({
    httpClient
}) => ({
    reportFormEventToAutomationCreator:
        () =>
        async ({
            detailedEventPayload,
            eventUTCTime
        }) => {
            const url = `/_api/action-triggers-server/v1/report-event`

            const body = {
                eventIdentifier: {
                    eventUniqueId: uuid.v4(),
                    eventType: 'form/form/code',
                    sourceUniqueId: '675bbcef-18d8-41f5-800e-131ec9e08762',
                },
                eventUTCTime,
                detailedEventPayload,
            }

            await httpClient.post(url, body)
        },
})