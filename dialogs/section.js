'use strict';

(function (CKEDITOR) {
    CKEDITOR.dialog.add('section', function (editor) {
        var lang = editor.lang.section;
        var common = editor.lang.common;
        var cfg = editor.config.section;
        var type = [[common.notSet, '']].concat(Object.getOwnPropertyNames(cfg).map(function (item) {
            return [cfg[item], item];
        }).sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }

            if (a[0] > b[0]) {
                return 1;
            }

            return 0;
        }));

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
                            items: type,
                            setup: function (widget) {
                                this.setValue(widget.data.type || '');
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
