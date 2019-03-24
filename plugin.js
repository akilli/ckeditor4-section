'use strict';

(function (CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        media: ['audio', 'iframe', 'image', 'video']
    };

    /**
     * Plugin
     */
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

            /**
             * Widget
             */
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
                        allowedContent: 'figure(audio, iframe, image, video); a[!href]; audio[!src, controls]; iframe[!src, width, height, allowfullscreen]; img[!src, width, height, alt]; video[!src, width, height, controls]; figcaption',
                        requiredContent: 'figure'
                    },
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: 'section(*); h2; div(!media); div(!content)',
                requiredContent: 'section; h2; div(media); div(content)',
                upcast: function (el, data) {
                    // Accept only section with configured classes
                    var type;

                    if (el.name !== 'section' || !(type = one(el, cfg))) {
                        return false;
                    }

                    // Remove empty sections
                    if (el.children.length <= 0) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    var children = el.children;
                    el.children = [];
                    data.type = type;

                    // Title
                    var title = children[0].name === 'h2' ? children.shift() : new CKEDITOR.htmlParser.element('h2');
                    el.add(title, 0);

                    // Media
                    var media = new CKEDITOR.htmlParser.element('div', {'class': 'media'});
                    el.add(media, 1);

                    if (children.length > 0 && !!isMedia(children[0])) {
                        media.add(children.shift());
                    }

                    // Content
                    if (children.length > 0 && isContent(children[0])) {
                        el.add(children.shift(), 2);
                    } else {
                        var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                        children.forEach(function (item) {
                            if (item.isEmpty || item.getHtml().trim()) {
                                content.add(item);
                            }
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

                    if (!!isMedia(media)) {
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

            /**
             * Dialog
             */
            CKEDITOR.dialog.add('section', this.path + 'dialogs/section.js');
        }
    });

    /**
     * Returns found class
     *
     * @param {CKEDITOR.htmlParser.element} el
     * @param {string[]} haystack
     *
     * @return {string|null}
     */
    function one(el, haystack) {
        if (!el || !Array.isArray(haystack)) {
            return null;
        }

        var result = null;

        for (var i = 0; i < haystack.length; i++) {
            if (el.hasClass(haystack[i])) {
                if (result) {
                    return null;
                }

                result = haystack[i];
            }
        }

        return result;
    }

    /**
     * Returns the media type if given element is a media element
     *
     * @param {CKEDITOR.htmlParser.element} el
     *
     * @return {string|null}
     */
    function isMedia(el) {
        return el && el.name === 'figure' ? one(el, defaults.media) : null;
    }

    /**
     * Indicates if given element is the content element
     *
     * @param {CKEDITOR.htmlParser.element} el
     *
     * @return {boolean}
     */
    function isContent(el) {
        return !!el && el.name === 'div' && el.attributes.class === 'content';
    }
})(CKEDITOR);
