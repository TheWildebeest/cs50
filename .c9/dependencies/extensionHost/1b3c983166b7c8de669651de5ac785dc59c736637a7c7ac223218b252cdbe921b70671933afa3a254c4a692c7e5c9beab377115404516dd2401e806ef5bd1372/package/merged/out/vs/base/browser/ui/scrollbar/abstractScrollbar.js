/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/browser/dom", "vs/base/browser/fastDomNode", "vs/base/browser/globalMouseMoveMonitor", "vs/base/browser/ui/scrollbar/scrollbarArrow", "vs/base/browser/ui/scrollbar/scrollbarVisibilityController", "vs/base/browser/ui/widget", "vs/base/common/platform"], function (require, exports, dom, fastDomNode_1, globalMouseMoveMonitor_1, scrollbarArrow_1, scrollbarVisibilityController_1, widget_1, platform) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
     */
    const MOUSE_DRAG_RESET_DISTANCE = 140;
    class AbstractScrollbar extends widget_1.Widget {
        constructor(opts) {
            super();
            this._lazyRender = opts.lazyRender;
            this._host = opts.host;
            this._scrollable = opts.scrollable;
            this._scrollbarState = opts.scrollbarState;
            this._visibilityController = this._register(new scrollbarVisibilityController_1.ScrollbarVisibilityController(opts.visibility, 'visible scrollbar ' + opts.extraScrollbarClassName, 'invisible scrollbar ' + opts.extraScrollbarClassName));
            this._mouseMoveMonitor = this._register(new globalMouseMoveMonitor_1.GlobalMouseMoveMonitor());
            this._shouldRender = true;
            this.domNode = fastDomNode_1.createFastDomNode(document.createElement('div'));
            this.domNode.setAttribute('role', 'presentation');
            this.domNode.setAttribute('aria-hidden', 'true');
            this._visibilityController.setDomNode(this.domNode);
            this.domNode.setPosition('absolute');
            this.onmousedown(this.domNode.domNode, (e) => this._domNodeMouseDown(e));
        }
        // ----------------- creation
        /**
         * Creates the dom node for an arrow & adds it to the container
         */
        _createArrow(opts) {
            let arrow = this._register(new scrollbarArrow_1.ScrollbarArrow(opts));
            this.domNode.domNode.appendChild(arrow.bgDomNode);
            this.domNode.domNode.appendChild(arrow.domNode);
        }
        /**
         * Creates the slider dom node, adds it to the container & hooks up the events
         */
        _createSlider(top, left, width, height) {
            this.slider = fastDomNode_1.createFastDomNode(document.createElement('div'));
            this.slider.setClassName('slider');
            this.slider.setPosition('absolute');
            this.slider.setTop(top);
            this.slider.setLeft(left);
            if (typeof width === 'number') {
                this.slider.setWidth(width);
            }
            if (typeof height === 'number') {
                this.slider.setHeight(height);
            }
            this.slider.setLayerHinting(true);
            this.domNode.domNode.appendChild(this.slider.domNode);
            this.onmousedown(this.slider.domNode, (e) => {
                if (e.leftButton) {
                    e.preventDefault();
                    this._sliderMouseDown(e, () => { });
                }
            });
            this.onclick(this.slider.domNode, e => {
                if (e.leftButton) {
                    e.stopPropagation();
                }
            });
        }
        // ----------------- Update state
        _onElementSize(visibleSize) {
            if (this._scrollbarState.setVisibleSize(visibleSize)) {
                this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
                this._shouldRender = true;
                if (!this._lazyRender) {
                    this.render();
                }
            }
            return this._shouldRender;
        }
        _onElementScrollSize(elementScrollSize) {
            if (this._scrollbarState.setScrollSize(elementScrollSize)) {
                this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
                this._shouldRender = true;
                if (!this._lazyRender) {
                    this.render();
                }
            }
            return this._shouldRender;
        }
        _onElementScrollPosition(elementScrollPosition) {
            if (this._scrollbarState.setScrollPosition(elementScrollPosition)) {
                this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
                this._shouldRender = true;
                if (!this._lazyRender) {
                    this.render();
                }
            }
            return this._shouldRender;
        }
        // ----------------- rendering
        beginReveal() {
            this._visibilityController.setShouldBeVisible(true);
        }
        beginHide() {
            this._visibilityController.setShouldBeVisible(false);
        }
        render() {
            if (!this._shouldRender) {
                return;
            }
            this._shouldRender = false;
            this._renderDomNode(this._scrollbarState.getRectangleLargeSize(), this._scrollbarState.getRectangleSmallSize());
            this._updateSlider(this._scrollbarState.getSliderSize(), this._scrollbarState.getArrowSize() + this._scrollbarState.getSliderPosition());
        }
        // ----------------- DOM events
        _domNodeMouseDown(e) {
            if (e.target !== this.domNode.domNode) {
                return;
            }
            this._onMouseDown(e);
        }
        delegateMouseDown(e) {
            let domTop = this.domNode.domNode.getClientRects()[0].top;
            let sliderStart = domTop + this._scrollbarState.getSliderPosition();
            let sliderStop = domTop + this._scrollbarState.getSliderPosition() + this._scrollbarState.getSliderSize();
            let mousePos = this._sliderMousePosition(e);
            if (sliderStart <= mousePos && mousePos <= sliderStop) {
                // Act as if it was a mouse down on the slider
                if (e.leftButton) {
                    e.preventDefault();
                    this._sliderMouseDown(e, () => { });
                }
            }
            else {
                // Act as if it was a mouse down on the scrollbar
                this._onMouseDown(e);
            }
        }
        _onMouseDown(e) {
            let offsetX;
            let offsetY;
            if (e.target === this.domNode.domNode && typeof e.browserEvent.offsetX === 'number' && typeof e.browserEvent.offsetY === 'number') {
                offsetX = e.browserEvent.offsetX;
                offsetY = e.browserEvent.offsetY;
            }
            else {
                const domNodePosition = dom.getDomNodePagePosition(this.domNode.domNode);
                offsetX = e.posx - domNodePosition.left;
                offsetY = e.posy - domNodePosition.top;
            }
            this._setDesiredScrollPositionNow(this._scrollbarState.getDesiredScrollPositionFromOffset(this._mouseDownRelativePosition(offsetX, offsetY)));
            if (e.leftButton) {
                e.preventDefault();
                this._sliderMouseDown(e, () => { });
            }
        }
        _sliderMouseDown(e, onDragFinished) {
            const initialMousePosition = this._sliderMousePosition(e);
            const initialMouseOrthogonalPosition = this._sliderOrthogonalMousePosition(e);
            const initialScrollbarState = this._scrollbarState.clone();
            this.slider.toggleClassName('active', true);
            this._mouseMoveMonitor.startMonitoring(globalMouseMoveMonitor_1.standardMouseMoveMerger, (mouseMoveData) => {
                const mouseOrthogonalPosition = this._sliderOrthogonalMousePosition(mouseMoveData);
                const mouseOrthogonalDelta = Math.abs(mouseOrthogonalPosition - initialMouseOrthogonalPosition);
                if (platform.isWindows && mouseOrthogonalDelta > MOUSE_DRAG_RESET_DISTANCE) {
                    // The mouse has wondered away from the scrollbar => reset dragging
                    this._setDesiredScrollPositionNow(initialScrollbarState.getScrollPosition());
                    return;
                }
                const mousePosition = this._sliderMousePosition(mouseMoveData);
                const mouseDelta = mousePosition - initialMousePosition;
                this._setDesiredScrollPositionNow(initialScrollbarState.getDesiredScrollPositionFromDelta(mouseDelta));
            }, () => {
                this.slider.toggleClassName('active', false);
                this._host.onDragEnd();
                onDragFinished();
            });
            this._host.onDragStart();
        }
        _setDesiredScrollPositionNow(_desiredScrollPosition) {
            let desiredScrollPosition = {};
            this.writeScrollPosition(desiredScrollPosition, _desiredScrollPosition);
            this._scrollable.setScrollPositionNow(desiredScrollPosition);
        }
    }
    exports.AbstractScrollbar = AbstractScrollbar;
});
//# sourceMappingURL=abstractScrollbar.js.map