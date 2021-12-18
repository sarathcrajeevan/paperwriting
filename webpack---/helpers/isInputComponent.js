export default component =>
    'onChange' in component && ('value' in component || 'checked' in component)