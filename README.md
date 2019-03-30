# Section Widget

This widget offers the possibility to add a configurable amount of *similar structured* types of content blocks into the editor.

Each type will have its custom CSS class and three optional editables: heading, media element and content.

The configuration expects an object with one or several CSS classes as the properties and the corresponding labels visible in the section dialog as the values, p.e.

    config.section: {'block-content': 'Inhaltsblock', 'block-info': 'Infoblock'};

You have to configure at least one type otherwise this widget will not initialize itself. 

## Demo

https://akilli.github.io/rte/ck4
