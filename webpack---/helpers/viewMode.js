const isModePreview = viewMode => viewMode === 'Preview'
const isModeLivePreview = viewMode => viewMode === 'Editor'
const isEnvLive = viewMode => viewMode === 'Site'
const isEnvEditor = viewMode =>
    isModePreview(viewMode) || isModeLivePreview(viewMode)

export {
    isModePreview,
    isModeLivePreview,
    isEnvLive,
    isEnvEditor
}