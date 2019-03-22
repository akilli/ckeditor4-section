'use strict';

(function (CKEDITOR) {
    function intersect(haystack, needle) {
        var filter = function (item) {
            return haystack.indexOf(item) >= 0;
        };

        return Array.isArray(haystack) && Array.isArray(needle) && needle.filter(filter).length > 0;
    }

    CKEDITOR.plugins.add('section', {
        requires: 'dialog,widget',
        icons: 'section',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            var cfg = editor.config.section ? Object.getOwnPropertyNames(editor.config.section) : [];

            if (cfg.length <= 0) {
                return;
            }

            editor.widgets.add('section', {
                button: editor.lang.section.title,
                dialog: 'section',
                template: '<section class=""><h2></h2><div class="media"></div><div class="content"></div></section>',
                editables: {
                    title: {
                        selector: 'h2',
                        allowedContent: 'a[!href]'
                    },
                    media: {
                        selector: '.media',
                        allowedContent: 'figure(audio, iframe, image, video)',
                        requiredContent: 'figure'
                    },
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: 'section(*); h2; div(!media); div(!content)',
                requiredContent: 'section; h2; div(media); div(content)',
                upcast: function (el) {
                    if (el.name !== 'section' || !intersect(cfg, el.classes)) {
                        return false;
                    }

                    var title = el.getFirst('h2');
                    var media = new CKEDITOR.htmlParser.element('div', {'class': 'media'});
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});

                    if (!!title && title.children.length > 0 && title.children[0].type === CKEDITOR.NODE_ELEMENT) {
                        title.setHtml(title.children[0].getHtml());
                    } else if (!!title && title.children.length > 0 && title.children[0].type === CKEDITOR.NODE_TEXT) {
                        title.setHtml(title.children[0].value);
                    } else if (!title) {
                        el.add(new CKEDITOR.htmlParser.element('h2'), 0);
                    }

                    el.add(media, 1);
                    el.add(content, 2);

                    if (el.children.length > 3) {
                        content.children = el.children.slice(3);
                        el.children = el.children.slice(0, 3);
                    }

                    return true;
                },
                downcast: function (el) {
                    if (!this.data.type) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Content
                    el.children[2].setHtml(this.editables.content.getData());
                    el.children[2].children.forEach(function (item) {
                        if (item.isEmpty || item.getHtml().trim()) {
                            el.add(item);
                        }
                    });
                    el.children[2].remove();

                    // Media
                    el.children[1].setHtml(this.editables.media.getData());
                    var media = el.children[1].getFirst('figure');

                    if (media) {
                        el.children[1].replaceWith(media);
                    } else {
                        el.children[1].remove();
                    }

                    // Title
                    if (!el.children[0].getHtml().trim()) {
                        el.children[0].remove();
                    } else {
                        el.children[0].attributes = [];
                    }

                    return el.children.length > 0 ? el : new CKEDITOR.htmlParser.text('');
                },
                data: function () {
                    if (this.data.type) {
                        this.element.setAttribute('class', this.data.type);
                    }
                }
            });

            CKEDITOR.dialog.add('section', this.path + 'dialogs/section.js');
        }
    });
})(CKEDITOR);
