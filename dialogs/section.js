'use strict';

(function (CKEDITOR) {
    CKEDITOR.dialog.add('section', function (editor) {
        var lang = editor.lang.section;

        return {
            title: lang.title,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 250,
            minHeight: 100,
            contents: [
                {
                    id: 'info',
                    label: lang.info,
                    elements: [
                        {
                            id: 'type',
                            type: 'select',
                            label: lang.type,
                            setup: function (widget) {
                                this.setValue(widget.data.type);
                            },
                            commit: function (widget) {
                                widget.setData('type', this.getValue());
                            },
                            validate: CKEDITOR.dialog.validate.notEmpty(lang.validateRequired)
                        }
                    ]
                }
            ]
        };
    });
})(CKEDITOR);
