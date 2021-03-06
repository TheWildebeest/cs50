/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/editor/common/core/range"], function (require, exports, range_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveCaretCommand {
        constructor(selection, isMovingLeft) {
            this._selection = selection;
            this._isMovingLeft = isMovingLeft;
            this._cutStartIndex = -1;
            this._cutEndIndex = -1;
            this._moved = false;
            this._selectionId = null;
        }
        getEditOperations(model, builder) {
            let s = this._selection;
            this._selectionId = builder.trackSelection(s);
            if (s.startLineNumber !== s.endLineNumber) {
                return;
            }
            if (this._isMovingLeft && s.startColumn === 0) {
                return;
            }
            else if (!this._isMovingLeft && s.endColumn === model.getLineMaxColumn(s.startLineNumber)) {
                return;
            }
            let lineNumber = s.selectionStartLineNumber;
            let lineContent = model.getLineContent(lineNumber);
            let left;
            let middle;
            let right;
            if (this._isMovingLeft) {
                left = lineContent.substring(0, s.startColumn - 2);
                middle = lineContent.substring(s.startColumn - 1, s.endColumn - 1);
                right = lineContent.substring(s.startColumn - 2, s.startColumn - 1) + lineContent.substring(s.endColumn - 1);
            }
            else {
                left = lineContent.substring(0, s.startColumn - 1) + lineContent.substring(s.endColumn - 1, s.endColumn);
                middle = lineContent.substring(s.startColumn - 1, s.endColumn - 1);
                right = lineContent.substring(s.endColumn);
            }
            let newLineContent = left + middle + right;
            builder.addEditOperation(new range_1.Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber)), null);
            builder.addEditOperation(new range_1.Range(lineNumber, 1, lineNumber, 1), newLineContent);
            this._cutStartIndex = s.startColumn + (this._isMovingLeft ? -1 : 1);
            this._cutEndIndex = this._cutStartIndex + s.endColumn - s.startColumn;
            this._moved = true;
        }
        computeCursorState(model, helper) {
            let result = helper.getTrackedSelection(this._selectionId);
            if (this._moved) {
                result = result.setStartPosition(result.startLineNumber, this._cutStartIndex);
                result = result.setEndPosition(result.startLineNumber, this._cutEndIndex);
            }
            return result;
        }
    }
    exports.MoveCaretCommand = MoveCaretCommand;
});
//# sourceMappingURL=moveCaretCommand.js.map