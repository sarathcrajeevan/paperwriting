export default (component, listener, handler, applicationCodeZone) =>
component[listener](applicationCodeZone(handler))