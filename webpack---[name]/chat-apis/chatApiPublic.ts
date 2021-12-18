//import { transformChatroom } from '@wix/wix-chat-transform-bo-events';
import { transformChatroom } from '@wix/wix-chat-transform-bo-events/dist/lib/transform-chatroom';
import * as generateToChat from './generateToChat';
import { MessageDirectionServer } from '@wix/wix-chat-transform-bo-events/dist/lib/types/public-types';

/**
 * @typedef $w.Chatbox~MessagePayload
 * @summary The content of a chat message.
 * @description
 * Currently only content of type text is included in the `MessagePayload` object.
 * @property {String} text Text of the chat message.
 * @snippet [Chatbox-onMessageSent.es6=Get the channel ID and message text when a chat message is sent]
 * @memberof $w.Chatbox
 * @see [`onMessageSent()`](#onMessageSent)
 * @see [`onMessageReceived()`](#onMessageReceived)
 */

/**

* @typedef $w.Chatbox~Message
* @summary An object that contains information about a chat message.
* @property {String} channelId ID of the channel on which the message was sent.
* @property {String} type Type of message. Currently only `TEXT` is supported.
* @property {String} summary First 250 characters of the chat message. Currently only text is included in the summary.
* @property {String} participantId The sender's member ID. For a message sent from the site's business, the site owner's member ID.
* @property {Date} createdAt Date and time the message was sent.
* @property {$w.Chatbox~MessagePayload} payload Content of the message.
* @property {Object} [metadata] An object representing additional contextual message information included in a chat message. Only relevant for messages sent using the backend [`sendMessage()`](wix-chat-backend.html#sendMessage) function. Site visitors do not see metadata.
* @snippet [Chatbox-onMessageSent.es6=Get the channel ID and message text when a chat message is sent]
* @snippet [Chatbox-onMessageReceived.es6=Get the channel ID and message text when a chat message is received]
* @memberof $w.Chatbox
* @see [`onMessageSent()`](#onMessageSent)
* @see [`onMessageReceived()`](#onMessageReceived)
*/

/**

 * @typedef $w.Chatbox~MessageInfo
 * @summary An object representing a chat message to be sent.
 * @property {String} messageText The text to be sent in the message.
 * @property {String} [channelId] The ID of the channel over which the message is sent. If empty, message is sent to the site's business.
 * @snippet [Chatbox-sendMessage-business.es6=Send a message from a site visitor to the site's business]
 * @snippet [Chatbox-sendMessage-channelId.es6=Send a message from a site visitor over a specific channel]
 * @memberof $w.Chatbox
 * @see [`sendMessage()`](#sendMessage)
 */

/**
 * @typedef $w.Chatbox~DisplayData
 * @summary An object representing display information associated with a [`Channel`](#channel).
 * @description
 * The data a site visitor sees in the chatbox. The data depends on the current channel type:
 *
 * <table style="border-collapse: collapse;">
 *   <tr>
 *     <td><b>Channel Type</b></td>
 *     <td><b>Description</b></td>
 *     <td><b>Display Data</b></td>
 *   </tr>
 *   <tr>
 *     <td>Business channel</td>
 *     <td>Connects the current user with the site's business</td>
 *     <td>Display data of the business</td>
 *   </tr>
 *   <tr>
 *     <td>Private social channel</td>
 *     <td>Connects the current user with one other member</td>
 *     <td>Display data of the other member</td>
 *   </tr>
 *   <tr>
 *     <td>Group social channel</td>
 *     <td>Connects the current user with other members in a chat group</td>
 *     <td>Display data of the chat group</td>
 *   </tr>
 * </table>
 *
 *
 * @property {String} image The image associated with the channel.
 *  One of the following:
 *
 *  + For private social channels, the image associated with the site member's account. If there is no image associated with the account, defaults to the avatar image.
 *  + For group social channels, the image associated with the chat group.
 *  + For business channels, `image` is not currently supported.
 *
 * @property {String} name For social channels, the member's name or chat group name. For business channels, the site's [display name](wix-site-backend.generalInfo.html#getSiteDisplayName).
 * @property {String} initials Only supported for business channels. Initials of the site's business.
 * @snippet [Chatbox-getChannel-displayData.es6=Get display data about a specific channel]
 * @memberof $w.Chatbox
 * @see [`getChannel()`](#getChannel)
 * @see [`getChannelList()`](#getChannelList)
 */

/**
 * @typedef $w.Chatbox~Channel
 * @summary An object representing a chat channel.
 * @property {String} id ID of the channel.
 * @property {$w.Chatbox~DisplayData} displayData Display information associated with the channel.
 * @property {$w.Chatbox~Message[]} messages An array of messages sent over the channel. Currently only the last message is included.
 * @snippet [Chatbox-getChannel-channelId.es6=Use a channel ID to get information about a specific channel]
 * @snippet [Chatbox-getChannelList.es6=Get a list of available chat channels]
 * @memberof $w.Chatbox
 * @see [`getChannel()`](#getChannel)
 * @see [`getChannelList()`](#getChannelList)
 */

/**
 * @typedef $w.Chatbox~ChannelInfo
 * @summary An object containing information about a chat channel.
 * @description
 * The `ChannelInfo` object is used by the [`getChannel()`](#getChannel) and
 * [`focusChannel()`](#focusChannel) functions to specify which channel to get or focus on.
 * @note
 *  At least one of the object properties is required. If `channelId` is passed, `type` is ignored.
 * @property {String} [channelId] ID of a chat channel.
 * @property {String} [type] Type of chat channel.
 *  One of the following:
 *
 *  + `"Focused"`: Currently focused channel.
 *  + `"Business"`: Business channel.
 *
 * @snippet [Chatbox-getChannel-channelId.es6=Get information about the channel associated with the specified channel ID]
 * @snippet [Chatbox-getChannel-focused.es6=Get information about the currently focused chat channel]
 * @memberof $w.Chatbox
 * @see [`getChannel()`](#getChannel)
 * @see [`focusChannel()`](#focusChannel)
 */

/**
 * @class Chatbox
 * @summary An element for sending and receiving chat messages.
 * @description
 * The <a href="https://support.wix.com/en/article/about-wix-chat" target="_blank">Wix Chat</a> application lets you communicate with site visitors via a chatbox.
 * The chatbox sends messages over a chat channel, which connects 2 or more chat participants.
 *
 * Site visitors can participate in the following chat scenarios:
 *
 *  + Business Chat: Site members and visitors chat with the site owner or contributor, referred to as the "business."
 *  + Social Chat: Site members chat with other site members, privately or in a group chat.
 *
 *
 *
 *
 * @note
 *  You cannot use a channel programmatically until it is created. A channel is created the first
 *  time the business or a visitor sends a message via the chatbox widget to a specific recipient.
 *
 *  You can also send chat messages from the [backend](wix-chat-backend.html) of your site.
 * @mixes $w.Element
 * @mixes $w.HiddenMixin
 * @memberof $w
 * @tagname Chatbox
 * @viewername mobile.core.components.Container
 * @definitionId mobile.core.components.Container
 * @definitionId wysiwyg.viewer.components.Group
 * @queryable
 */

/**
 * @member hidden
 * @label property
 * @summary Indicates if the chatbox is visible or hidden.
 * @description
 *  If `hidden` is `true`, the chatbox is not displayed on the page.
 *
 *  If `hidden` is `false`, the chatbox is displayed on the page.
 *
 *  To set the `hidden` property on the chatbox, use the chatbox's
 *  [`hide()`](#hide) or [`show()`](#show) functions.
 *
 *  If you select **Hidden on load** in the chatbox's Properties panel
 *  in the Editor, the `hidden` property is set to `true` when the page loads.
 * @snippet [Chatbox-hidden.es6=Get the chatbox's hidden status]
 * @snippet [Chatbox-toggle-hidden.es6=Toggle an element's hidden state]
 * @type {Boolean}
 * @default false
 * @see [hide( )](#hide)
 * @see [show( )](#show)
 * @memberof $w.Chatbox
 * @attr {Boolean} hidden
 * @readonly
 * @override
 */

/**
 * @member isVisible
 * @label property
 * @syntax
 * get isVisible(): boolean
 * @summary Indicates if the element is actually visible.
 * @description
 *  If `isVisible` is `true`, the element is displayed on the page.
 *
 *  If `isVisible` is `false`, the element is not displayed on the page.
 * @snippet [Chatbox-isVisible.es6=Get whether the chatbox is visible]
 * @type {Boolean}
 * @default true
 * @memberof $w.Chatbox
 * @attr {Boolean} visible
 * @readonly
 * @override
 */

/**

 * @member parent
 * @label property
 * @syntax
 * get parent(): Node
 * @summary <b>Note: This standard element property is not relevant for Chatbox.</b>
 * @description
 * Gets the element's parent element.
 *
 *  Some elements can contain other elements. This occurs when you drag
 *  an element onto a container element. The container is the `parent` of
 *  all the elements it contains.
 *
 *  [`Page`]($w.Page.html), [`Header`]($w.Header.html), and
 *  [`Footer`]($w.Footer.html) are top-level elements and have no parent.
 * @type {$w.Node}
 * @default null
 * @see [children]($w.ContainableMixin.html#children)
 * @memberof $w.Chatbox
 * @readonly
 * @override
 */

/**
 * @member global
 * @label property
 * @syntax
 * get global(): boolean
 * @summary Indicates if an element appears on all pages or only on the current page.
 * @description
 *  If `global` is `true`, the element appears on all pages.
 *
 *  If `global` is `false`, the element only appears on the current page.
 * @snippet [Chatbox-global_get.es6=Get whether an element is displayed on all pages]
 * @type {external:Boolean}
 * @default false
 * @memberof $w.Chatbox
 * @readonly
 * @override
 */

/**
 * @function scrollTo
 * @syntax
 * function scrollTo(): Promise<void>
 * @summary <b>Note: This standard element function is not relevant for Chatbox.</b>
 * @description
 *  Scrolls the page to the element using an animation.
 *
 *  The `scrollTo()` function returns a Promise that is resolved when the
 *  animated scroll is complete and the element is now in view.
 *
 *  To scroll to a specific location on the page, see the `wix-window`
 *  [`scrollTo()`](wix-window.html#scrollTo) function.
 *
 *  Calling the `scrollTo()` function on an element in a repeated item that
 *  is selected from the [global scope]($w.Repeater.html#global-scope) causes
 *  an error.
 * @returns {Promise}
 * @fulfill {void} When the scroll is complete.
 * @memberof $w.Chatbox
 * @override
 */

/**
 * @function onViewportEnter
 * @summary <b>Note: This standard element event is not relevant for Chatbox.</b>
 * @description
 *  Adds an event handler that runs when an element is displayed
 *  in the viewable part of the current window.
 *
 *  An element enters the viewport when the page is scrolled to show any
 *  part of the element. An element also enters the viewport if it was
 *  [hidden]($w.HiddenMixin.html#hidden) or [collapsed]($w.CollapsedMixin.html#collapsed)
 *  and is then shown or expanded in the viewable part of the current window. `onViewportEnter()`
 *  is not fired for [hidden]($w.HiddenMixin.html#hidden) or [collapsed]($w.CollapsedMixin.html#collapsed)
 *  elements even if they are scrolled into view.
 * @note
 *  **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 *  a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 *  and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 *  <a href="https://www.wix.com/code/home/forum/wix-tips-and-updates/removal-of-the-w-parameter-from-event-handlers" target="_blank">here</a>.
 * @param {$w.EventHandler} handler The name of the function or
 *  the function expression to run when the element enters the viewport.
 * @returns {$w.Element} The element on which the event is now registered.
 * @see [onViewportLeave( )](#onViewportLeave)
 * @memberof $w.Chatbox
 * @eventtype viewportEnter
 * @eventhandler
 * @override
 */

/**
 * @function onViewportLeave
 * @summary <b>Note: This standard element event is not relevant for Chatbox.</b>
 * @description
 *  Adds an event handler that runs when an element is no longer
 *  displayed in the viewable part of the current window.
 *
 *  An element leaves the viewport when the page is scrolled so that the
 *  element is completely out of view. An element also leaves the viewport
 *  if it was shown or expanded and is then [hidden]($w.HiddenMixin.html#hidden)
 *  or [collapsed]($w.CollapsedMixin.html#collapsed) from the viewable part
 *  of the current window.  `onViewportLeave()`
 *  is not fired for [hidden]($w.HiddenMixin.html#hidden) or [collapsed]($w.CollapsedMixin.html#collapsed)
 *  elements even if they are scrolled out of view.
 * @note
 *  **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 *  a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 *  and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 *  <a href="https://www.wix.com/code/home/forum/wix-tips-and-updates/removal-of-the-w-parameter-from-event-handlers" target="_blank">here</a>.
 * @param {$w.EventHandler} handler The name of the function or
 *  the function expression to run when the element leaves the viewport.
 * @returns {$w.Element} The element on which the event is now registered.
 * @see [onViewportEnter( )](#onViewportEnter)
 * @memberof $w.Chatbox
 * @eventtype viewportLeave
 * @eventhandler
 * @override
 */

/**
 * @function onMessageReceived
 * @memberof $w.Chatbox
 * @summary An event that fires when a site visitor receives a chat message.
 * @description
 *  The `onMessageReceived()` event handler runs when a chat message is received
 *  by a site visitor. The received `Message`
 *  object contains information about the message that was received.
 * @note
 *  `onMessageReceived()` runs if the message was sent via the chatbox widget. It does not run if the message was sent programatically using [`sendMessage()`](#sendMessage).
 *
 *  `onMessageReceived()` doesn't work when previewing your site.
 * @snippet [Chatbox-onMessageReceived.es6=Get message data when a chat message is received]
 * @param {$w.Chatbox~Message} message The message that was received.
 * @returns {void}
 */

const validateParamTypeOrChannelExists = (
  { type = '', channelId = '' },
  functionName,
) => {
  const paramIsEmpty = type === '' && channelId === '';
  const typeIsValid = ['Business', 'Focused', ''].includes(type);
  if (paramIsEmpty || !typeIsValid) {
    throw new Error(
      `${functionName} expect to get valid type (Business / Focused) or channelId`,
    );
  }
  return;
};

const onMessageReceived = (callback) => {
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageReceived',
    callback,
    MessageDirectionServer.BusinessToCustomer,
  );
};

/**
 * @function onMessageSent
 * @memberof $w.Chatbox
 * @summary An event that fires when a site visitor sends a chat message.
 * @description
 *  The `onMessageSent()` event handler runs when a chat message is sent. The sent `Message`
 *  object contains information about the message that was sent.
 * @note
 * `onMessageSent()` runs if the message was sent via the chatbox widget. It does not run if the message was sent programatically using [`sendMessage()`](#sendMessage).
 *
 * `onMessageSent()` doesn't work when previewing your site.
 * @snippet [Chatbox-onMessageSent.es6=Get message data when a chat message is sent]
 * @param {$w.Chatbox~Message} message The message that was sent.
 * @returns {void}
 */

const onMessageSent = (callback) => {
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageSent',
    callback,
    MessageDirectionServer.CustomerToBusiness,
  );
  return;
};

/**
 * @function onMinimize
 * @memberof $w.Chatbox
 * @summary An event that fires when the chatbox is minimized.
 * @snippet [Chatbox-onMinimize.es6=Register a callback to run after the chatbox is minimized]
 * @returns {void}
 */

const onMinimize = (callback) =>
  generateToChat.callbackEvent(
    'ChatWidget.onWidgetCollapsed',
    callback,
    'Collapsed',
  );

/**
 * @function onMaximize
 * @memberof $w.Chatbox
 * @summary An event that fires when the chatbox is maximized.
 * @snippet [Chatbox-onMaximize.es6=Register a callback to run after the chatbox is maximized]
 * @returns {void}
 */

const onMaximize = (callback) =>
  generateToChat.callbackEvent('ChatWidget.onWidgetExpand', callback, 'Expand');

/**
 * @function sendMessage
 * @summary Sends a chat message from a site visitor.
 * @description
 *  The `sendMessage()` function returns a Promise that is resolved when
 *  the message is sent.
 *
 *  Currently only chat messages containing text can be sent programatically.
 * @note
 *  Chat messages sent programatically by the `sendMessage()` function do not trigger
 *  the [`onMessageSent()`](#onMessageSent) event handler.
 * @param {$w.Chatbox~MessageInfo} messageInfo An object representing the message to be sent.
 * @snippet [Chatbox-sendMessage-business.es6=Send a message from a site visitor to the business]
 * @snippet [Chatbox-sendMessage-channelId.es6=Send a message from a site visitor over a specific channel]
 * @returns {Promise}
 * @fulfill {void} When the message is sent.
 * @memberof $w.Chatbox
 */

const sendMessage = ({ messageText, channelId = null }) =>
  generateToChat.request('ChatWidget.sendMessage', {
    message: messageText,
    chatroom: channelId,
  });

/**
 * @function maximize
 * @summary Expands the chatbox and sets its [`maximized`](#maximized) property to `true`.
 * @description
 *  The `maximize()` function returns a Promise that is resolved when
 *  the chatbox finishes expanding.
 *
 * @snippet [Chatbox-maximize.es6=Maximize the chatbox]
 * @snippet [Chatbox-maximize-console.es6=Maximize the chatbox and log a message when done]
 * @snippet [Chatbox-maximized-toggle.es6=Toggle a chatbox's maximized state]
 * @returns {Promise}
 * @fulfill {void} When the chatbox is maximized.
 * @memberof $w.Chatbox
 */

const maximize = () => generateToChat.request('ChatWidget.expandWidget', {});

/**
 * @function minimize
 * @summary Collapses the chatbox and sets its [`maximized`](#maximized) property to `false`.
 * @description
 *  The `minimize()` function returns a Promise that is resolved when
 *  the chatbox finishes collapsing.
 *
 * @snippet [Chatbox-minimize.es6=Minimize the chatbox]
 * @snippet [Chatbox-minimize-console.es6=Minimize the chatbox and log a message when done]
 * @snippet [Chatbox-maximized-toggle.es6=Toggle a chatbox's maximized state]
 * @returns {Promise}
 * @fulfill {void} When the chatbox is minimized.
 * @memberof $w.Chatbox
 */

const minimize = () => generateToChat.request('ChatWidget.collapseWidget', {});

/**
 * @function focusChannel
 * @summary Expands the chatbox and focuses it on the specified chat channel.
 * @description
 *  The `focusChannel()` function returns a Promise that is resolved when
 *  the chatbox focuses on the specified channel.
 *
 *  You can focus on a channel by specifying one of the following:
 *
 *  + Channel ID: Focus on the channel with the specified ID. `type` is ignored.
 *  + Type: Focus on the channel of the specified type. Currently, only type `Business` is supported.
 *
 * @param {$w.Chatbox~ChannelInfo} channelInfo Channel information specifying which channel to focus on.
 * @snippet [Chatbox-focusChannel.es6=Expand the chatbox and focus it on the channel with the specified ID]
 * @snippet [Chatbox-focusChannel-type.es6=Expand the chatbox and focus it on the business channel]
 * @returns {Promise}
 * @fulfill {void} When the chat box focuses on the channel.
 * @memberof $w.Chatbox
 */

const focusChannel = async ({ channelId = '', type = '' } = {}) => {
  validateParamTypeOrChannelExists({ type, channelId }, 'focusChannel');
  return generateToChat.request('ChatWidget.focusChannel', { type, channelId });
};

/**
 * @function getChannelList
 * @summary Gets a list of available chat channels for a site visitor.
 * @description
 *  The `getChannelList()` function returns a Promise that resolves to a
 *  list of available channels for the site visitor.
 * @snippet [Chatbox-getChannelList.es6=Get a list of available chat channels]
 * @returns {Promise}
 * @fulfill {$w.Chatbox~Channel[]} When the list of channels has been retrieved.
 * @memberof $w.Chatbox
 */

const getChannelList = async () => {
  const listOfServerChatroomsDTO = await generateToChat.requestWithResult(
    'ChatWidget.getChatState',
    {},
    'chatrooms',
  );
  const listOfApiChatroomsDTO = listOfServerChatroomsDTO.map((chatroom) =>
    transformChatroom(chatroom._chatroom),
  );
  return listOfApiChatroomsDTO;
};

/**
 * @member maximized
 * @label property
 * @summary Indicates if the chatbox is maximized.
 * @description
 *  If `maximized` is `true`, the chatbox is expanded. If `maximized` is `false`,
 *  the chatbox is minimized.
 * @type {Boolean}
 * @snippet [Chatbox-maximized_get.es6=Get the chatbox's maximized status]
 * @snippet [Chatbox-maximized-toggle.es6=Toggle a chatbox's maximized state]
 * @memberof $w.Chatbox
 * @readonly
 */

const maximized = () =>
  generateToChat.requestWithResult(
    'ChatWidget.getChatState',
    {},
    'isWidgetExpanded',
  );

/**
 * @function getChannel
 * @summary Gets a chatbox channel.
 * @description
 *  The `getChannel()` function returns a Promise that resolves to the requested channel.
 *  You can get a channel by specifying one of the following:
 *
 *  + Channel ID: Gets the channel with the specified ID. `type` is ignored.
 *  + Type: Gets the channel of the specified type:
 *
 *     + "Focused": Gets the currently focused channel.
 *     + "Business": Gets the business channel.
 *
 *
 * @param {$w.Chatbox~ChannelInfo} channelInfo Channel information specifying which channel to get.
 * @snippet [Chatbox-getChannel-channelId.es6=Get information about the channel associated with the specified channel ID]
 * @snippet [Chatbox-getChannel-focused.es6=Get information about the currently focused chat channel]
 * @memberof $w.Chatbox
 * @returns {Promise}
 * @fulfill {$w.Chatbox~Channel} When the information associated with the specific channel has been retrieved.
 * @memberof $w.Chatbox
 */

const getChannel = async ({ type = '', channelId = '' } = {}) => {
  validateParamTypeOrChannelExists({ type, channelId }, 'getChannel');
  const serverChatroomDTO: any = await generateToChat.request(
    'ChatWidget.getChannel',
    { type, channelId },
  );
  const apiChatroomDTO = transformChatroom(serverChatroomDTO.channel);
  return apiChatroomDTO;
};

const startChannel = ({ type = '', userId = '' } = {}) =>
  generateToChat.requestWithResult(
    'ChatWidget.startChannel',
    {
      type,
      userId,
    },
    'channelId',
  );

export const chatApiPublic = {
  onMessageReceived,
  onMessageSent,
  onMinimize,
  onMaximize,
  sendMessage,
  maximize,
  minimize,
  focusChannel,
  getChannelList,
  maximized,
  getChannel,
  startChannel,
};
