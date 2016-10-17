import React from 'react'
import Overlay from 'react-overlays/lib/Overlay'
import {Close} from 'components/button'
import controls from 'components/controls/Controls.css'
import Callout, {BOTTOM} from 'components/callout'
import {TimePicker} from 'components/controls'
import {DayPicker, DateUtils} from 'components/misc'
import Button from 'components/button'
import styles from './Picker.css'

const CONTAINER_STYLE = {
    position: 'relative',
}

function defaultFormat(value) {
    return value
}

function create(overrides = {}) {
    function template(locals) {
        return template.renderContainer(locals)
    }

    template.getFormat = overrides.getFormat || function getFormat(locals) {
        return locals.format || defaultFormat
    }

    template.renderContainer = overrides.renderContainer || function renderContainer(locals) {
        const {id} = locals.attrs

        return (
            <div id={`container-${id}`} style={CONTAINER_STYLE}>
                {template.renderInput(locals)}
                <Overlay
                    show={locals.isOpen}
                    onHide={locals.close}
                    onBackdropClick={locals.close}
                    onEscapeKeyUp={locals.close}
                    placement='bottom'
                    container={document.querySelector(`#container-${id}`)}
                    target={document.querySelector(`#container-${id} input`)}
                    rootClose
                    backdrop
                    shouldUpdatePosition>
                    <Callout placement='Bottom'>
                        <div className={styles.Container}>
                            {template.renderContent(locals)}
                            {template.renderButton(locals)}
                        </div>
                    </Callout>
                </Overlay>
            </div>
        )
    }

    template.renderResetButton = overrides.renderResetButton || function renderResetButton(locals) {
        if (!locals.value) {
            return null
        }

        return (
            <div className={controls['Addon--Right']}>
                <Close onClick={locals.onReset} />
            </div>
        )
    }

    template.renderInput = overrides.renderInput || function renderStatic(locals) {
        return locals.disabled ?
            template.renderDisabledInput(locals) :
            template.renderEnabledInput(locals)
    }

    template.renderEnabledInput = overrides.renderEnabledInput || function renderEnabledInput(locals) {
        const format = template.getFormat(locals)

        return (
            <div className={controls.Group}>
                <input {...locals.attrs}
                    autoComplete='off'
                    onClick={() => locals.toggle()}
                    onChange={() => {}}
                    value={format(locals.value)} />
                {template.renderResetButton(locals)}
            </div>
        )
    }

    template.renderDisabledInput = overrides.renderDisabledInput || function renderDisabledInput(locals) {
        const format = template.getFormat(locals)

        return (
            <input {...locals.attrs}
                autoComplete='off'
                disabled
                onChange={() => {}}
                value={format(locals.value)} />
        )
    }

    template.renderButton = overrides.renderButton || function renderButton(locals) {
        const {value, close, onChange} = locals
        function handleClick() {
            // TODO: Send the default value
            onChange(value)
            close()
        }

        return (
            <Button className={styles.Button} onClick={handleClick}>
                Done
            </Button>
        )
    }

    template.renderContent = overrides.renderContent || function renderContent(locals) {
        return null
    }

    template.clone = function clone(newOverrides = {}) {
        return create({...overrides, ...newOverrides})
    }

    return template
}

export default create()
