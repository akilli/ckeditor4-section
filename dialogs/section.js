'use strict';

(function (CKEDITOR) {
    CKEDITOR.dialog.add('section', function (editor) {
        var lang = editor.lang.section;
        var common = editor.lang.common;

        return {
            title: lang.title,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 250,
            minHeight: 100,
            contents: [
                {
                    id: 'general',
                    label: common.generalTab,
                    elements: [
                        {
                            id: 'css',
                            type: 'select',
                            label: lang.css,
                            setup: function (widget) {
                                this.setValue(widget.data.css);
                            },
                            commit: function (widget) {
                                widget.setData('css', this.getValue());
                            }
                        }
                    ]
                }
            ]
        };
    });
})(CKEDITOR);
