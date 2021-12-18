import {
    AddressInput,
    RatingsInput,
    TextInput,
    TextBox,
    RichTextBox,
    Checkbox,
    DatePicker,
    RadioButtonGroup,
    Dropdown,
    UploadButton,
    ToggleSwitch,
    Slider,
    TimePicker,
    CheckboxGroup,
    SelectionTags,
    SignatureInput,
} from '@wix/dbsm-common/src/componentTypes'

import {
    ADDRESSINPUT_ROLE,
    RATINGSINPUT_ROLE,
    TEXT_INPUT_ROLE,
    TEXT_BOX_ROLE,
    RICH_TEXT_BOX_ROLE,
    CHECKBOX_ROLE,
    DATEPICKER_ROLE,
    RADIOGROUP_ROLE,
    DROPDOWN_ROLE,
    UPLOAD_BUTTON_ROLE,
    TOGGLESWITCH_ROLE,
    SLIDER_ROLE,
    TIMEPICKER_ROLE,
    CHECKBOX_GROUP_ROLE,
    SELECTION_TAGS_ROLE,
    SIGNATURE_INPUT_ROLE,
} from './connection-config/roles'

const inputComponents = [{
        type: AddressInput,
        role: ADDRESSINPUT_ROLE
    },
    {
        type: RatingsInput,
        role: RATINGSINPUT_ROLE
    },
    {
        type: TextInput,
        role: TEXT_INPUT_ROLE
    },
    {
        type: TextBox,
        role: TEXT_BOX_ROLE
    },
    {
        type: RichTextBox,
        role: RICH_TEXT_BOX_ROLE
    },
    {
        type: Checkbox,
        role: CHECKBOX_ROLE
    },
    {
        type: DatePicker,
        role: DATEPICKER_ROLE
    },
    {
        type: RadioButtonGroup,
        role: RADIOGROUP_ROLE
    },
    {
        type: Dropdown,
        role: DROPDOWN_ROLE
    },
    {
        type: UploadButton,
        role: UPLOAD_BUTTON_ROLE
    },
    {
        type: ToggleSwitch,
        role: TOGGLESWITCH_ROLE
    },
    {
        type: Slider,
        role: SLIDER_ROLE
    },
    {
        type: TimePicker,
        role: TIMEPICKER_ROLE
    },
    {
        type: CheckboxGroup,
        role: CHECKBOX_GROUP_ROLE
    },
    {
        type: SelectionTags,
        role: SELECTION_TAGS_ROLE
    },
    {
        type: SignatureInput,
        role: SIGNATURE_INPUT_ROLE
    },
]

export const types = inputComponents.map(comp => comp.type)
export const roles = inputComponents.map(comp => comp.role)