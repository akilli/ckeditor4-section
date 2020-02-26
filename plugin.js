/**
 * Section Widget
 *
 * @author Ayhan Akilli
 */
'use strict';

(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('section', {
        requires: 'api,dialog,widget',
        icons: 'section',
        hidpi: true,
        lang: 'de,en,uk',
        init: function (editor) {
            var css = Object.getOwnPropertyNames(editor.config.section || {});
            var classes = {};

            css.forEach(function (item) {
                classes[item] = true;
            });

            /**
             * Widget
             */
            editor.widgets.add('section', {
                button: editor.lang.section.title,
                dialog: css.length > 0 ? 'section' : null,
                template: '<section><h2></h2><div class="media"></div><div class="content"></div></section>',
                editables: {
                    title: {
                        selector: 'h2',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            }
                        }
                    },
                    media: {
                        selector: 'div.media',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            },
                            audio: {
                                attributes: {controls: true, src: true},
                                requiredAttributes: {controls: true, src: true}
                            },
                            figcaption: true,
                            figure: {
                                classes: {audio: true, iframe: true, image: true, left: true, right: true, video: true}
                            },
                            iframe: {
                                attributes: {allowfullscreen: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            },
                            img: {
                                attributes: {alt: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            },
                            video: {
                                attributes: {controls: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            }
                        }
                    },
                    content: {
                        selector: 'div.content',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            },
                            br: true,
                            em: true,
                            p: true,
                            li: true,
                            ol: true,
                            strong: true,
                            ul: true
                        }
                    }
                },
                allowedContent: {
                    div: {
                        classes: {content: true, media: true}
                    },
                    h2: true,
                    section: {
                        classes: classes
                    }
                },
                requiredContent: 'section',
                defaults: {
                    css: ''
                },
                upcastPriority: 20,
                upcast: function (el, data) {
                    if (el.name !== 'section') {
                        return false;
                    }

                    data.css = CKEDITOR.api.parser.hasClass(el, css) || '';

                    // Title
                    if (el.children.length < 1 || el.children[0].name !== 'h2') {
                        el.add(new CKEDITOR.htmlParser.element('h2'), 0);
                    }

                    // Media
                    if (el.children.length < 2 || !CKEDITOR.api.parser.isMediaFigure(el.children[1])) {
                        el.add(new CKEDITOR.htmlParser.element('div', {'class': 'media'}), 1);
                    } else {
                        el.children[1].wrapWith(new CKEDITOR.htmlParser.element('div', {'class': 'media'}));
                    }

                    // Content
                    if (el.children.length < 3 || el.children[2].name !== 'div' || !el.children[2].hasClass('content')) {
                        var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                        el.add(content, 2);
                        content.children = el.children.slice(3);
                    }

                    el.children = el.children.slice(0, 3);

                    return true;
                },
                downcast: function (el) {
                    // Content
                    el.children[2].setHtml(this.editables.content.getData());
                    el.children[2].children.forEach(CKEDITOR.api.parser.remove);
                    this.editables.content.setHtml(el.children[2].getHtml());

                    if (el.children[2].children.length <= 0) {
                        el.children[2].remove();
                    }

                    // Media
                    el.children[1].setHtml(this.editables.media.getData());
                    var media = el.children[1].getFirst('figure');

                    if (!!CKEDITOR.api.parser.isMediaFigure(media)) {
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

                    css.forEach(function (item) {
                        el.removeClass(item);
                    });

                    if (!!this.data.css) {
                        el.addClass(this.data.css);
                    }
                }
            });

            /**
             * Dialog
             */
            if (css.length > 0) {
                CKEDITOR.dialog.add('section', this.path + 'dialogs/section.js');
            }
        },
        onLoad: function () {
            CKEDITOR.addCss(
                'section {line-height: 1.5rem;padding: 0.75rem 0.75rem 0.75rem 13.5rem;border: 0.0625rem solid #ddd;border-radius: 0.5rem;}' +
                'section::before {display: table;content: " ";}' +
                'section::after {display: table;content: " ";clear: both;}' +
                'section > h2 {margin-bottom: 0.75rem;}' +
                'section > div.media, section > figure {position: relative;width: 12rem;height: 12.75rem;float: left;margin: -3rem 0 0 -12.75rem;object-fit: cover;object-position: center;}' +
                'section > div.media figure {float: none;margin: 0;background: #fff;}' +
                'section > div.media iframe, section > div.media img, section > div.media video, section > figure iframe, section > figure img, section > figure video {max-height: 10.5rem;}' +
                'section > div.content {min-height: 9.75rem;}' +
                'section .cke_widget_editable {background: #eee;outline: none !important;}'
            );
        }
    });

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (ev.data.name !== 'section' || typeof ev.editor.config.section !== 'object') {
            return;
        }

        /**
         * Type select
         */
        var css = ev.data.definition.contents[0].elements[0];
        css.items = [[ev.editor.lang.common.notSet, '']].concat(Object.getOwnPropertyNames(ev.editor.config.section).map(function (item) {
            return [ev.editor.config.section[item], item];
        }).sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }

            if (a[0] > b[0]) {
                return 1;
            }

            return 0;
        }));
    }, null, null, 1);
})(CKEDITOR);
