'use strict';

(function (CKEDITOR) {
    function intersect(haystack, needle) {
        var filter = function (item) {
            return haystack.indexOf(item) >= 0;
        };

        return Array.isArray(haystack) && Array.isArray(needle) && needle.filter(filter).length > 0;
    }

    function isMedia(el) {
        return el.name === 'figure' && intersect(el.attributes.class, ['audio', 'iframe', 'image', 'video']);
    }

    function isContent(el) {
        return el.name === 'div' && el.attributes.class === 'content';
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
                    // Accept only section with configured classes
                    if (el.name !== 'section' || !intersect(cfg, el.classes)) {
                        return false;
                    }

                    // Remove empty sections
                    if (el.children.length <= 0) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Title
                    if (el.children[0].name !== 'h2') {
                        el.add(new CKEDITOR.htmlParser.element('h2'), 0);
                    }

                    // Media
                    var media = new CKEDITOR.htmlParser.element('div', {'class': 'media'});
                    el.add(media, 1);

                    if (el.children.length > 2 && isMedia(el.children[2])) {
                        media.add(el.children[2]);
                    }

                    // Content
                    if (el.children.length < 3 || !isContent(el.children[2])) {
                        var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                        el.add(content, 2);
                        el.children.slice(3).forEach(function (item) {
                            if (!item.isEmpty && !item.getHtml().trim()) {
                                item.remove();
                            } else {
                                content.add(item);
                            }
                        });
                    } else {
                        el.children.slice(3).forEach(function (item) {
                            item.remove();
                        });
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
                        if (!item.isEmpty && !item.getHtml().trim()) {
                            item.remove();
                        }
                    });

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
                    var el = this.element;

                    if (this.data.type) {
                        cfg.forEach(function (item) {
                            el.removeClass(item);
                        });
                        el.addClass(this.data.type);
                    }
                }
            });

            CKEDITOR.dialog.add('section', this.path + 'dialogs/section.js');
        }
    });
})(CKEDITOR);
